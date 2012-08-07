/*******************************************************************************
 * Copyright (C) 2010 Technische Universität Dresden
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * 	http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * Dresden, University of Technology, Faculty of Computer Science
 * Computer Networks Group: http://www.rn.inf.tu-dresden.de
 * mobilis project: http://mobilisplatform.sourceforge.net
 ******************************************************************************/
package de.tudresden.inf.rn.mobilis.android.xhunt.proxy;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.widget.Toast;

import com.google.android.maps.GeoPoint;

import de.tudresden.inf.rn.mobilis.android.xhunt.Const;

/**
 * The Class GPSProxy is used to update the players current position.
 */
public class GPSProxy {
	
	/** The Constant TAG for logging. */
	public static final String TAG = "GPSProxy";

	/** The Constant INTENT_LOCATION_CHANGED. */
	public static final String INTENT_LOCATION_CHANGED 
		= "de.tudresden.inf.rn.mobilis.android.xhunt.proxy.GPSProxy.LocationChanged";
	
	/** The current location. */
	private Location mCurrentLocation;
	
	/** The LocationManager. */
	private LocationManager mLocationManager;
	
	/** True if GPS is up. false if not (just for testing purposes). */
	private boolean mIsGpsRunning;
	
	/** The thread who is listening for location changes. */
	private LocationListenerThread mLocationListener;
	
	/** The min distance(in meters) before a new GPS fix is needed. */
	float mGpsMinDistance = 2;
	
	/** The time in millisecond before a new GPS fix is needed.. */
	long mGpsMinTime = 5 * 1000;
	
	/** The applications context. */
	private Context mContext;
	
	/** The formatter to format the date. */
	private DateFormat mDateFormatter;
	
	/** The GPX file for logging movement of the player in a file (without GPX header). */
	private File mGpxFile;
	
	/** True if logging of movement is active. */
	private boolean mLogTracks = false;
	
	/**
	 * Instantiates a new GPSProxy.
	 *
	 * @param ctx the applications context
	 */
	public GPSProxy(Context ctx){
		this.mContext = ctx;
		
		mLocationManager = (LocationManager) ctx.getSystemService(Context.LOCATION_SERVICE);
		mIsGpsRunning = false;
		
		mDateFormatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
		
		// TODO: need to put an options in SettingsActivity for toggling logging of tracks
		mLogTracks = true;
		
		initGpx();
	}
	
	/**
	 * Gets the current location.
	 *
	 * @return the current location
	 */
	public Location getCurrentLocation(){
		return mCurrentLocation;
	}
	
	/**
	 * Gets the current location as GeoPoint.
	 *
	 * @return the current location as GeoPoint
	 */
	public GeoPoint getCurrentLocationAsGeoPoint(){
		return parseLocation(mCurrentLocation);
	}
	
	/**
	 * Inits the GPX logging. This function will create a new folder and file with 
	 * the current timestamp.
	 */
	private void initGpx(){
		File sdFolder = new File(Environment.getExternalStorageDirectory().getAbsoluteFile(),
				"xhunt");
		if(!sdFolder.isDirectory())
			sdFolder.mkdir();
		
		File gpxFolder = new File(sdFolder.getAbsoluteFile(), "gpx");
		if(!gpxFolder.isDirectory())
			gpxFolder.mkdir();
		
		mGpxFile = new File(gpxFolder.getAbsoluteFile(), System.currentTimeMillis() + ".gpx");
	}

	/**
	 * Parses the location as GeoPoint.
	 *
	 * @param loc the locaion
	 * @return the GeoPoint
	 */
	public GeoPoint parseLocation(Location loc) {
		return loc != null
			? new GeoPoint((int)(loc.getLatitude() * 1E6), (int)(loc.getLongitude() * 1E6))
			: null;
	}
	
	/**
	 * Restart GPS.
	 *
	 * @param ctx the applications context
	 */
	public void restartGps(Context ctx){
		this.mContext = ctx;
		
		mLocationManager = (LocationManager) mContext.getSystemService(Context.LOCATION_SERVICE);
		
		startGps();
	}
	
	/**
	 * Send location changed broadcast to inform all listening components.
	 */
	private void sendLocationChangedBroadcast(){
		GeoPoint currentGeoPoint = parseLocation(mCurrentLocation);
		
		Intent i = new Intent(INTENT_LOCATION_CHANGED);
		i.putExtra(Const.BUNDLE_KEY_LOCATION_CHANGED_LAT, currentGeoPoint.getLatitudeE6());
		i.putExtra(Const.BUNDLE_KEY_LOCATION_CHANGED_LON, currentGeoPoint.getLongitudeE6());
		
		mContext.sendBroadcast(i);
	}
	
	/**
	 * Toggle the logging for tracks.
	 *
	 * @param log the new on logging tracks
	 */
	public void setOnLoggingTracks(boolean log){
		this.mLogTracks = log;
	}
	
	/**
	 * Start GPS.
	 */
	public void startGps(){
		if(!mIsGpsRunning){			
			if(mLocationListener != null){
				mLocationManager.removeUpdates(mLocationListener);
				mLocationListener.interrupt();
			}
			
			mLocationListener = new LocationListenerThread();
			mLocationManager.requestLocationUpdates(
					LocationManager.GPS_PROVIDER,
					mGpsMinTime,
					mGpsMinDistance,
					mLocationListener);
			
			Location lastLocation = 
					mLocationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
			
			if(lastLocation != null)
				mCurrentLocation = lastLocation;  
			
			mIsGpsRunning = true;
		}
	}
	
	/**
	 * Sets a location for testing purposes.
	 *
	 * @param latitude the latitude
	 * @param longitude the longitude
	 */
	public void setLocation(int latitude, int longitude){
		mCurrentLocation = new Location(LocationManager.GPS_PROVIDER);
		mCurrentLocation.setLatitude((double)latitude / 1E6);
		mCurrentLocation.setLongitude((double)longitude / 1E6);
		
		Log.v(TAG, "setLoc manual to: " + mCurrentLocation);
	}
	
	/**
	 * Stop GPS.
	 */
	public void stopGps(){
		if(mLocationManager != null && mLocationListener != null)
			mLocationManager.removeUpdates(mLocationListener);
		
		mIsGpsRunning = false;
	}
	
	/**
	 * Write location to file for logging purposes. Location will be formatted to 
	 * match the GPX standards without providing a header in GPX file (have to be 
	 * insert manually).
	 *
	 * @param location the location to log
	 */
	private void writeLocationToFile(Location location){	
		// element '<trkpt>' contains the location(latitude, longitude, altitude(in '<ele>')) 
		//and a timestamp ('<time>') when the player visits this location
		String track = "<trkpt lat=\"" 
				+ location.getLatitude() 
				+ "\" lon=\"" + location.getLongitude() 
				+ "\">\n<ele>" + (int)location.getAltitude() 
				+ "</ele>\n<time>" 
				+ mDateFormatter.format(location.getTime()) 
				+ "</time>\n</trkpt>\n";
		
		// writes the data to file
	    FileOutputStream os;
		try {
			os = new FileOutputStream(mGpxFile, true);

			OutputStreamWriter out = new OutputStreamWriter(os);
			out.write(track);
			out.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	
	/**
	 * The Class LocationListenerThread is listening for location updates.
	 */
	private class LocationListenerThread extends Thread implements LocationListener {
		
		/* (non-Javadoc)
		 * @see android.location.LocationListener#onLocationChanged(android.location.Location)
		 */
		@Override
		public void onLocationChanged(Location location) {
				// store new locations locally
				mCurrentLocation = location;
				
				// log new location if logging is on
				if(mLogTracks)
					writeLocationToFile(location);
				
				// notify all listening components for new location
				sendLocationChangedBroadcast();
		}

		/* (non-Javadoc)
		 * @see android.location.LocationListener#onProviderDisabled(java.lang.String)
		 */
		@Override
		public void onProviderDisabled(String provider) {}

		/* (non-Javadoc)
		 * @see android.location.LocationListener#onProviderEnabled(java.lang.String)
		 */
		@Override
		public void onProviderEnabled(String provider) {}

		/* (non-Javadoc)
		 * @see android.location.LocationListener#onStatusChanged(java.lang.String, int, android.os.Bundle)
		 */
		@Override
		public void onStatusChanged(String provider, int status, Bundle extras) {
//			String[] stat = {"Out of Service","Temporarily Unavailable","Available"};
			
//			Log.v(TAG, "Provider \'" + provider + "\' changed status to: " + stat[status]);
		}
	}
}
