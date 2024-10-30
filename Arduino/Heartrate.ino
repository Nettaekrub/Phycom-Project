#include <Wire.h> 
#include <LiquidCrystal_I2C.h>
#define USE_ARDUINO_INTERRUPTS true   
#define BACKLIGHT_PIN 13

LiquidCrystal_I2C lcd(0x27 ,2 ,1 ,0 ,4 ,5 ,6 ,7 , 3, POSITIVE);  // Set the LCD I2C address
#include <PulseSensorPlayground.h>    

const int PulsePin = A0;            // Pin for Pulse Sensor
const int LEDPin = 13;              // Pin for indicator LED
int Threshold = 400;                // Threshold value for detecting heartbeats

PulseSensorPlayground pulseSensor;  // Create an instance of the PulseSensor class

bool isPulseSensorEnabled = false;  // เริ่มต้นโดยเซ็นเซอร์ชีพจรจะปิด
unsigned long lastUpdateTime = 0;   // Variable to store the last update time
const unsigned long updateInterval = 1000; // Interval for 10 seconds

const int numReadings = 10;
int readings[numReadings];          // Array to store last few readings
int readIndex = 0;                  // Index for current reading
int total = 0;                      // Total of readings
int averageBPM = 0;                 // Average BPM

// Custom characters for Heart and Wave
byte Heart[] = {
  B00000,
  B01010,
  B11111,
  B11111,
  B01110,
  B00100,
  B00000,
  B00000
};

byte Wave[] = {
  B00000,
  B00001,
  B00010,
  B10100,
  B01000,
  B10000,
  B00000,
  B00000
};

void setup() {
  Serial.begin(9600);                 // Initialize serial communication at 9600 baud rate
  pulseSensor.analogInput(PulsePin);  // Attach the pulse sensor to the analog input pin
  pulseSensor.blinkOnPulse(LEDPin);   // Blink the onboard LED with each heartbeat detected
  pulseSensor.setThreshold(Threshold); // Set the heartbeat detection threshold

  if (pulseSensor.begin()) {           // Initialize the Pulse Sensor
    Serial.println("Pulse Sensor started successfully");
  }

  pinMode(BACKLIGHT_PIN, OUTPUT);

  lcd.begin(16, 2);                   // Initialize the LCD
  lcd.createChar(1, Wave);            // Create wave character with ID 0
  lcd.createChar(0, Heart);           // Create heart character with ID 1

  lcd.clear();
  lcd.setCursor(0, 0);                // Set cursor to top-left position
  lcd.print("Hello 4lnwza");      // Display greeting message
  lcd.setCursor(0, 1);
  lcd.write(byte(0));                 // Display wave symbol
  lcd.setCursor(1, 1);  
  lcd.write(byte(0)); 
  lcd.setCursor(2, 1);  
  lcd.write(byte(0)); 
  lcd.setCursor(3, 1);  
  lcd.write(byte(0)); 
  lcd.setCursor(4, 1);  
  lcd.write(byte(0)); 
  lcd.setCursor(5, 1);  
  lcd.write(byte(0)); 
  lcd.setCursor(6, 1);  
  lcd.write(byte(0)); 
  lcd.setCursor(7, 1);  
  lcd.write(byte(0)); 
  lcd.setCursor(8, 1);  
  lcd.write(byte(0)); 
  lcd.setCursor(9, 1);  
  lcd.write(byte(0)); 
  lcd.setCursor(10, 1);  
  lcd.write(byte(0)); 
  lcd.setCursor(11, 1);  
  lcd.write(byte(0)); 
  lcd.setCursor(12, 1);  
  lcd.write(byte(0)); 
  lcd.setCursor(13, 1);  
  lcd.write(byte(0)); 
  lcd.setCursor(14, 1);  
  lcd.write(byte(0)); 
  lcd.setCursor(15, 1);  
  lcd.write(byte(0));                 // Display heart symbol next to wave
  delay(3000);                        // Wait for the message to appear
  lcd.clear();
  lcd.print("Tell Chatbot to");
  lcd.setCursor(0,1);
  lcd.print("turn on device");  
  
  for (int i = 0; i < numReadings; i++) {
    readings[i] = 0;
  }
}

void loop() {
  if (Serial.available() > 0) {
    char command = Serial.read();
    // ถ้าได้รับ '1' ให้เปิดเซ็นเซอร์
    if (command == '1' && !isPulseSensorEnabled) {
      isPulseSensorEnabled = true;
      lcd.clear();
      lcd.print("Sensor Enabled");
      delay(1000);
    }
    // ถ้าได้รับ '0' ให้ปิดเซ็นเซอร์
    else if (command == '0'  && isPulseSensorEnabled) {
      isPulseSensorEnabled = false;
      lcd.clear();
      lcd.print("Sensor Disabled");
      delay(1000);
      lcd.clear();
      lcd.print("Tell Chatbot to");
      lcd.setCursor(0,1);
      lcd.print("turn on device"); 
    }
  }



 if (isPulseSensorEnabled) {
    int rawValue = analogRead(PulsePin);
    int myBPM = pulseSensor.getBeatsPerMinute();
    if (pulseSensor.sawStartOfBeat()) {
        // Subtract last reading and add new reading to smooth BPM values
        total -= readings[readIndex];
        readings[readIndex] = myBPM;
        total += readings[readIndex];
        readIndex = (readIndex + 1) % numReadings;
        averageBPM = total / numReadings;

        // Display values on LCD
        lcd.clear();
        lcd.setCursor(0, 0);                       // Set cursor to top-left position
        lcd.write(byte(0));                        // Display wave symbol
        lcd.write(byte(1));                        // Display heart symbol next to wave
        lcd.print(" Heartbeat!");                  // Display message

        lcd.setCursor(0, 1);
        lcd.print("BPM: ");
        lcd.print(averageBPM);
        lcd.print(" bpm");

        Serial.print("BPM:");
        Serial.println(averageBPM);
        delay(9000);
      }
    delay(updateInterval);  // Delay for the defined interval
  }
}
