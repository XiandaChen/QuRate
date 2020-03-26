# QuRate Description

QuRate is a power optimization tool for VR video streaming, which consider both power consumption and QoE (Quality of Experience).

The videos in the experiment are from [this](https://dl.acm.org/doi/10.1145/3083187.3083215) dataset paper.

# Repository Hierarchy

```
 |--------player 							// players for each video
 |--------src
            |--------dash  					// JS library for DASH streaming
            |--------webvr 					// JS library for VR video playback
 |--------video 							// DASH-ed video files
            |--------1 //DASH-ed video 1
            |--------2 //DASH-ed video 2
            |--------3 //DASH-ed video 3
            |--------4 //DASH-ed video 4
            |--------5 //DASH-ed video 5
            |--------6 //DASH-ed video 6
 |--------chromium_webvr_v1_android.apk 	// special version of Chromium for playback
 |--------QuRate.html 						// main page of QuRate
```


# Hardware Requirement

* An Android smartphone as client
* A PC as the server
* [Power monitor](https://www.msoon.com/online-store) if need to measure the power
* A HMD if need to view the VR video with a better experience

# System Setup

* Install the special version of Chromium `chromium_webvr_v1_android.apk` on the smartphone
* Clone all the source file to the server folder on PC, inside the server folder
* Make sure the smartphone and the PC are in the same wireless connection

# Testing & Evaluation

* On the URL bar in Chromium, type `path-to-locolhost-folder/QuRate.html`
* Choose a video
* Before playback, make sure the smartphone is vertical
* Click on "LOAD PLAYER", "Play", and "Enter VR" buttons
* View the video in any HMD
* Click "Back to play list" button to go back to the play list for other videos

# Known Issue

* Might not work for all browsers. The provide browser apk is guarantee to work
* If enter the video with the phone in horizontal mode, playback might fail

# Power measurement

* Refer to the [guide](https://msoon.github.io/powermonitor/PowerTool/doc/Power%20Monitor%20Manual.pdf) of the power monitor tool to connect the smartphone and computer
* Follow the steps above the load the player and compare the power consumption

# License
MIT
