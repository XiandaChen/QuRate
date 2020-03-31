# QuRate Overview

QuRate is a quality-aware and user-centric frame rate adaptation mechanism to tackle the power consumption issue in immersive video streaming (a.k.a., 360-degree video streaming) on smartphones, which is described in our recently accepted MMSys 2020 paper:

Nan Jiang, Yao Liu, Tian Guo, Wenyao Xu, Viswanathan Swaminathan, Lisong Xu, Sheng Wei, QuRate: Power-Efficient Mobile Immersive Video Streaming, ACM Multimedia Systems Conference, to appear, June 2020.

QuRate optimizes the immersive video power consumption by modeling the correlation between the perceivable video quality and the user behavior. Specifically, it builds on top of the user's reduced level of concentration on the video frames during view switching and dynamically adjusts the frame rate without impacting the perceivable video quality.

This repository contains the source code, tools, and detailed setup instructions needed to run the end-to-end 360-degree video streaming system with QuRate in place, which can be used to conduct the power measurements and obtain the power evaluation results reported in the paper. In particular, we provide the following three versions of the system for the readers who would like to reproduce QuRate results at various levels.
* Default, the original 360-degree video streaming system without power optimization;
* QuRate_verbose, the version of QuRate with frame rate output, for the readers to observe the effects of QuRate without conducting power measurements; and
* QuRate, the version of QuRate for power evaluations using the power monitor.


# Repository Hierarchy

```
 |-----player                          // Player for each video
       |-----original
       |-----qurate_fr_observation
       |-----qurate_power_measurement
 |-----src
       |-----dash                     // JS of DASH streaming
       |-----webvr_fr_observation     // JS of QuRate_verbose for frame rate observation
       |-----webvr_original           // JS of Default VR video playback
       |-----webvr_power_measurement  // JS of QuRate for power measurement
 |-----video                          // DASH-ed video files
       |-----1 //DASH-ed video 1
       |-----2 //DASH-ed video 2
       |-----3 //DASH-ed video 3
       |-----4 //DASH-ed video 4
       |-----5 //DASH-ed video 5
       |-----6 //DASH-ed video 6
 |-----tool
       |-----chromium_webvr_v1_android.apk   // special version of Chromium browser
 |-----QuRate.html                     // main page of QuRate
```

# Hardware and Software Requirements
### Hardware Requirements
* An Android smartphone as the mobile HMD. In our experiments, we have tested QuRate with LG V20, Samsung S7, Moto G5, LG G4, and Google Pixel 1. Other Android phones may also work but have not been tested with. 
* A desktop or laptop computer as the web server.
* (Optional) an Monsoon power monitor (https://www.msoon.com/online-store), if the readers would like to conduct power evaluation on QuRate.
* (Optional) A cable to connect the smartphone with the computer, if the readers chose to use the "Remote devices" feature of Chrome (i.e., Method 2 under the QuRate_verbose mode).


### Software Requirements
* 6 test videos (provided under the "video" folder of this repository) were obtained from the following dataset paper:

      Xavier Corbillon, Francesca De Simone, and Gwendal Simon, 360-Degree Video Head Movement Dataset. ACM Multimedia Systems Conference (MMSys), pp. 199–204, 2017. 

* Chromium browser `chromium_webvr_v1_android.apk` (provided under the "tool" folder of this repository).

# System Setup

1. Install the Chromium browser `chromium_webvr_v1_android.apk` on the smartphone. (The provided version under the "tool" folder has been tested to work.)
1. Setup a web server on the computer. (We have tested the system with Apache(https://httpd.apache.org/) on Linux. Other web servers on other operating systems may also work but have not been tested with)
1. Client/Server setup: Clone and deploy all the source files of this repository onto the web server. Connect the smartphone and the server to the same WIFI/wired network, and make sure that the files on the web server are accessible from the smartphone browser via HTTP.


# Running 360-degree VR video streaming
This section introduces how to run the 360-degree video streaming system with the three modes: Default (original system without power optimization), QuRate_verbose (QuRate with frame rate output for observation), and QuRate (QuRate without output log for power measurements).

# General Procedure
1. On the smartphone, access `path-to-localhost-folder/QuRate.html` from the Chromium browser.
1. Choose a video from the playlist (please refer to the descriptions of the three test modes below for details). 
1. (**IMPORTANT**) Before playback, please make sure the smartphone is placed with the vertical orientation.
1. Click on "**LOAD PLAYER**", "**Play**", and "**Enter VR**" buttons to initiate the VR video playback.
1. View the VR video on the smartphone or wear the smartphone together with the Google Cardboard to have the full VR video experience.
1. Exit the full-screen mode by clicking the "**Back to play list**" button to go back to the playlist for other videos.

### The Default Mode
In Step 3 above, choose a video from the Default list. This is the original VR streaming system without QuRate for power optimization, which serves as the baseline for comparison. 

### The QuRate_verbose Mode
This is the VR streaming system with QuRate enabled for power optimization. This "verbose" mode outputs the varying frame rate information generated by QuRate for the readers to observe. Due to the additional power overhead caused by generating the output log, this version of QuRate only for observations of the QuRate's effects on frame rates without conducting power measurements.
1. In Step 3 above, choose a video from the "QuRate_verbose" list.
1. Following either of the following two methods to observe the varying frame rate produced by QuRate.

##### Method 1: directly observe the frame rate output from the browser page
1. Set the system up following the above 6 steps, except for Step 4, where the "Enter VR" button should not be pushed. 
1. Move the orientation of the smartphone quickly and keep monitoring the numbers changing in "Frame rate is XX FPS".
* **NOTE**, we do not need to enter the VR mode to view the frame rate information, since the WebVR library starts working as soon as the page is loaded.

##### Method 2: "Remote devices" feature of Chrome
1. Open a Chrome browser on the computer.
1. Set up the "Remote devices" feature on Chrome following the instructions here (https://developers.google.com/web/tools/chrome-devtools/remote-debugging?utm_campaign=2016q3&utm_medium=redirect&utm_source=dcc).
1. Enable USB debugging on the smartphone following the instructions here: https://developer.android.com/studio/debug/dev-options.
1. Connect the smartphone and the computer using a USB cable.
1. Enter the VR mode and playback the VR video on the smartphone.
1. Observe the frame rate information from the console chrome browser.
* **NOTE**, according to the design of QuRate, frame rate reduction occurs only when the smartphone is in motion (i.e., switching views).

### The QuRate Mode
In Step 3 above, choose a video from the QuRate list. This is the mode with QuRate enabled but without the frame rate output, intended for power evaluation without the potential power overhead caused by logging.  

# Power Measurements
This section describes how to measure and compare the power consumption of "Default" and "QuRate" modes from the playlist. Please refer to the previous section for the steps to set up the player. Below are the details to set up the power monitor. 

1. Refer to the [guide](https://msoon.github.io/powermonitor/PowerTool/doc/Power%20Monitor%20Manual.pdf) of the power monitor tool to connect the smartphone and computer. **Make sure the smartphone is charged by the power monitor, not any cable.** The power monitor can be controlled by the power tool application on the computer. 
1. The setup requires modification to the battery system of the smartphone. It will be easier if the smartphone has a removable battery. The details can be found in [this link](https://mostly-tech.com/tag/monsoon-power-monitor/).
1. Load the videos from the "Default" or "QuRate" list, with the same steps as introduced in previous section.
1. Compare power consumption when playing the same video with different modes.

* **NOTE**, power reduction is more obvious when the smartphone is constantly moving at high speed.

# Known Issue

* Might not work for all browsers. The provided chromium browser apk has been tested to work.
* The playback might fail if the video is entered when the phone is in horizontal mode. 

# License
MIT
