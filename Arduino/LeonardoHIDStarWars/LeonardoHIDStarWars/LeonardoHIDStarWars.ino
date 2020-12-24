// Gery Casiez
// Dec 2020

#include "HID-Project.h"

uint8_t receiveBufOutRep[64]; 

boolean debug = false;

int laserButton = 2;


void setup() {
  if (debug) {
    Serial.begin(115200);
    while(!Serial);
    Serial.println("Serial console enabled");
  }

  attachInterrupt(digitalPinToInterrupt(laserButton), laserInterrupt, RISING);

  // Set the RawHID OUT report array.
  RawHID.begin(receiveBufOutRep, sizeof(receiveBufOutRep));
  for (int i = 0; i < sizeof(receiveBufOutRep); ++i) {
    receiveBufOutRep[i] = 0;
  }
}

void laserInterrupt() {
    sendData('L');
}

void sendData(unsigned char source) {
  receiveBufOutRep[2] = source;
  
  int n = RawHID.write(receiveBufOutRep, sizeof(receiveBufOutRep));
  if (debug) {
    Serial.print("Sent ");
    Serial.print(n);
    Serial.println(" bytes");
  }  
}

void loop() {

}
