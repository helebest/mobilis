package de.tudresden.inf.rn.mobilis.gwtemulationserver.server.beans;

import org.xmlpull.v1.XmlPullParser;

import de.tudresden.inf.rn.mobilis.xmpp.beans.XMPPBean;

public class StartRequest extends XMPPBean {

	private String appNamespace = null;
	private int instanceId = Integer.MIN_VALUE;
	private String parameters = null;


	public StartRequest( String appNamespace, int instanceId, String parameters ) {
		super();
		this.appNamespace = appNamespace;
		this.instanceId = instanceId;
		this.parameters = parameters;

		this.setType( XMPPBean.TYPE_SET );
	}

	public StartRequest(){
		this.setType( XMPPBean.TYPE_SET );
	}


	@Override
	public void fromXML( XmlPullParser parser ) throws Exception {
		boolean done = false;
			
		do {
			switch (parser.getEventType()) {
			case XmlPullParser.START_TAG:
				String tagName = parser.getName();
				
				if (tagName.equals(getChildElement())) {
					parser.next();
				}
				else if (tagName.equals( "appNamespace" ) ) {
					this.appNamespace = parser.nextText();
				}
				else if (tagName.equals( "instanceId" ) ) {
					this.instanceId = Integer.parseInt( parser.nextText() );
				}
				else if (tagName.equals( "parameters" ) ) {
					this.parameters = parser.nextText();
				}
				else if (tagName.equals("error")) {
					parser = parseErrorAttributes(parser);
				}
				else
					parser.next();
				break;
			case XmlPullParser.END_TAG:
				if (parser.getName().equals(getChildElement()))
					done = true;
				else
					parser.next();
				break;
			case XmlPullParser.END_DOCUMENT:
				done = true;
				break;
			default:
				parser.next();
			}
		} while (!done);
	}

	public static final String CHILD_ELEMENT = "StartRequest";

	@Override
	public String getChildElement() {
		return CHILD_ELEMENT;
	}

	public static final String NAMESPACE = "emulation:iq:start";

	@Override
	public String getNamespace() {
		return NAMESPACE;
	}

	@Override
	public XMPPBean clone() {
		StartRequest clone = new StartRequest( appNamespace, instanceId, parameters );
		clone.cloneBasicAttributes( clone );

		return clone;
	}

	@Override
	public String payloadToXML() {
		StringBuilder sb = new StringBuilder();

		sb.append( "<appNamespace>" )
			.append( this.appNamespace )
			.append( "</appNamespace>" );

		sb.append( "<instanceId>" )
			.append( this.instanceId )
			.append( "</instanceId>" );

		sb.append( "<parameters>" )
			.append( this.parameters )
			.append( "</parameters>" );

		sb = appendErrorPayload(sb);

		return sb.toString();
	}


	public String getAppNamespace() {
		return this.appNamespace;
	}

	public void setAppNamespace( String appNamespace ) {
		this.appNamespace = appNamespace;
	}

	public int getInstanceId() {
		return this.instanceId;
	}

	public void setInstanceId( int instanceId ) {
		this.instanceId = instanceId;
	}

	public String getParameters() {
		return this.parameters;
	}

	public void setParameters( String parameters ) {
		this.parameters = parameters;
	}

}