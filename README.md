# QuRate Description

QuRate is a power optimization tool for VR video streaming, which consider both power consumption and QoE (Quality of Experience).

The videos in the experiment are from [this](https://dl.acm.org/doi/10.1145/3083187.3083215) dataset paper.

This repo contains three versions of video playback: original, QuRate for frame rate observation, and QuRate for power measurement, due to presenting frame rate in real-time might consume extra power.

# Repository Hierarchy

```
 |--------player                                      // players for each video
            |--------original
            |--------qurate_fr_observation
            |--------qurate_power_measurement
 |--------src
            |--------dash                                   // JS library of DASH streaming
            |--------webvr_fr_observation             // JS library of QuRate VR video playback for frame rate observation
            |--------webvr_original                   // JS library of original VR video playback
            |--------webvr_power_measurement    // JS library of QuRate VR video playback for power measurement
 |--------video                                             // DASH-ed video files
            |--------1 //DASH-ed video 1
            |--------2 //DASH-ed video 2
            |--------3 //DASH-ed video 3
            |--------4 //DASH-ed video 4
            |--------5 //DASH-ed video 5
            |--------6 //DASH-ed video 6
 |--------chromium_webvr_v1_android.apk   // special version of Chromium for playback
 |--------QuRate.html                                 // main page of QuRate
```


# Hardware Requirement

* An Android smartphone as a client.
* A computer as the server.
* [Power monitor](https://www.msoon.com/online-store) if need to measure the power.
* An HMD if need to view the VR video with a better experience.
* A cable to connect the smartphone with the computer if need to use the "Remote devices" feature of Chrome.

# System Setup

* Install the special version of Chromium `chromium_webvr_v1_android.apk` on the smartphone.
* Setup a server on the computer. [XAMPP](https://www.apachefriends.org/index.html) on Windows 10 and [Apache](https://httpd.apache.org/) on Linux system is tested and guaranteed to work. Other server setups should also work.
* Clone all the source files to the server folder on the computer, inside the server folder.
* Make sure the smartphone and the PC are in the same wireless connection.

# Testing & Evaluation

* On the URL bar in Chromium, type `path-to-localhost-folder/QuRate.html`.
* Choose a video from "Original" or "QuRate(frame rate observation)" lists.
* Before playback, make sure the smartphone is vertical.
* Click on "LOAD PLAYER", "Play", and "Enter VR" buttons.
* View the video in any HMD.
* Click "Back to play list" button to go back to the play list for other videos.

# Observe Frame Rate Reduction
* Choose any video from the "QuRate(frame rate observation)" list.
* Method 1: before entering the VR mode, move the smartphone quickly and keep monitoring the number changing from the browser where it says "Frame rate is XX FPS".
* Method 2: enter the VR mode. Use the "Remote devices" feature of Chrome browser and read the console log from a computer. The detail of "Remote devices" is described below.
* Note in method 1, you do not need to enter VR mode to view the frame rate change because the WebVR library is working once the page is loaded. However, it might be hard to catch the change by human eyes since the smartphone is moving back and forth quickly.

# "Remote devices" feature of Chrome
* The steps of setting up the "Remote devices" feature on Chrome can be found in [this link](https://developers.google.com/web/tools/chrome-devtools/remote-debugging?utm_campaign=2016q3&utm_medium=redirect&utm_source=dcc).
* Make sure the smartphone has debug mode enabled. Follow [this link](https://www.youtube.com/watch?v=Ucs34BkfPB0).
* Connect smartphone and computer with cable.
* Follow the steps in "Testing & Evaluation" to view the video from the "QuRate(frame rate observation)" list.
* Observe the frame rate output in the console log of smartphone on computer.

# Power measurement

* Refer to the [guide](https://msoon.github.io/powermonitor/PowerTool/doc/Power%20Monitor%20Manual.pdf) of the power monitor tool to connect the smartphone and computer.
* Follow the steps in "Testing & Evaluation" the load the player list page.
* Compare the power consumption of videos from "Original" or "QuRate(power measurement)" lists.
* Note, power reduction is more obvious when the smartphone is constantly moving at high speed.

# Known Issue

* Might not work for all browsers. The provide browser apk is guarantee to work.
* If enter the video with the phone in horizontal mode, playback might fail.

# License
MIT
