# jCardSimSample

This is a sample project to demonstrate how you can write a java card applet and test it via smartcardPage. This project includes a simple HTTP Server on top of [jCardSim](https://github.com/licel/jcardsim) to simulate java card environment in regular desktop Java Virtual Machine (JVM). If you select `jcardsim` in smartcardPage, smartcardBridge connects to this simulator.

## Description

jCardSimSample uses [gradle](https://github.com/gradle/gradle) to build java application. It uses
[jCardSim](https://github.com/licel/jcardsim) to simulate java card. jCardSimSample uses a snapshot compiled version (3.0.5) of jCardSim which supports [Java Card Classic Platform Specification 3.0.5](http://download.oracle.com/otn-pub/java/java_card_kit/3.0.5/java_card_kit-classic-3_0_5-ga-spec-doc-b33-03_jun_2015.zip).

## Compile and Run

To run the simulator, you need to run debug in VSCode. You must install smartcardBridge and open smartcardPage.
If you would like to compile your java card applet code to load into real smart card, you may use [ant-javacard](https://github.com/martinpaljak/ant-javacard) to compile your code and convert that to a CAP file, and [GlobalPlatformPro](https://github.com/martinpaljak/GlobalPlatformPro) to load the CAP file to a real smart card. You will need a java card and a PC/SC smart card reader too.

## Change of address

jCardSimSample serves at http://localhost:4444 by default. If you want to change that, you can update the service address for jCardSimSample at /src/main/java.jcardsimsample/Server.java.
