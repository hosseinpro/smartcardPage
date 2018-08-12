package testappletpackage;

import javacard.framework.*;

public class testapplet extends Applet {

    public static byte[] AID = { (byte) 0xF0, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x01 };

    public static void install(byte[] bArray, short bOffset, byte bLength) {
        new testapplet().register();
    }

    public testapplet() {
    }

    public void process(APDU apdu) {
        if (selectingApplet()) {
            return;
        }

        byte[] buf = apdu.getBuffer();
        switch (buf[ISO7816.OFFSET_INS]) {
        case (byte) 0xD1:
            break;
        default:
            ISOException.throwIt(ISO7816.SW_INS_NOT_SUPPORTED);
        }
    }

}
