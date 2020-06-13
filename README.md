# QuRate Overview

QuRate is a quality-aware and user-centric frame rate adaptation mechanism to tackle the power consumption issue in immersive video streaming (a.k.a., 360-degree video streaming or VR video streaming) on smartphones, which is described in our recently accepted MMSys 2020 paper:

Nan Jiang, Yao Liu, Tian Guo, Wenyao Xu, Viswanathan Swaminathan, Lisong Xu, Sheng Wei. QuRate: Power-Efficient Mobile Immersive Video Streaming. ACM Multimedia Systems Conference (MMSys), pp. 99–111, June 2020.

QuRate optimizes the immersive video power consumption by modeling the correlation between the perceivable video quality and the user behavior. Specifically, it builds on top of the user's reduced level of concentration on the video frames during view switching and dynamically adjusts the frame rate without impacting the perceivable video quality.

This repository contains the source code, tools, and detailed setup instructions needed to run the end-to-end 360-degree video streaming system with QuRate in place, which can be used to conduct the power measurements and obtain the power evaluation results reported in the paper. In particular, we provide the following three versions of the system for the readers who would like to reproduce QuRate results at various levels.
* Default, the original 360-degree video streaming system without power optimization;
* QuRate_verbose, the version of QuRate with frame rate output, for the readers to observe the effects of QuRate without conducting power measurements; and
* QuRate, the version of QuRate for power evaluations using the power monitor.

Moreover, the details of seting up the frame rate library (FRL) for QuRate will be introduced in "Section Build and update frame rate library (FRL)".

# Repository Hierarchy
Artifacts: [![DOI](https://zenodo.org/badge/250305918.svg)](https://zenodo.org/badge/latestdoi/250305918)

```
 |-----player                          // Player for different modes
       |-----original
       |-----qurate_fr_observation
       |-----qurate_power_measurement
       |-----frl_update
 |-----src
       |-----dash                     // JS of DASH streaming
       |-----webvr_fr_observation     // JS of QuRate_verbose for frame rate observation
       |-----webvr_original           // JS of Default VR video playback
       |-----webvr_power_measurement  // JS of QuRate for power measurement
       |-----frl_update               // JS code for FRL update
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
* (Optional) A Monsoon power monitor (https://www.msoon.com/online-store), if the readers would like to conduct power evaluation on QuRate.
* (Optional) A USB cable to connect the smartphone with the computer, if the readers chose to use the "Remote devices" feature of Chrome (i.e., Method 2 under the QuRate_verbose mode).


### Software Requirements
* 6 test videos (provided under the "video" folder of this repository) were obtained from the following dataset paper:

      Xavier Corbillon, Francesca De Simone, and Gwendal Simon, 360-Degree Video Head Movement Dataset. ACM Multimedia Systems Conference (MMSys), pp. 199–204, 2017. 

* Chromium browser `chromium_webvr_v1_android.apk` (provided under the "tool" folder of this repository).

# System Setup

1. Install the Chromium browser `chromium_webvr_v1_android.apk` on the smartphone. (The provided version under the "tool" folder has been tested to work.)
1. Setup a web server on the computer. (We have tested the system with Apache(https://httpd.apache.org/) on Linux. Other web servers on other operating systems may also work but have not been tested with)
1. Client/Server setup: Clone and deploy all the source files of this repository onto the web server. Connect the smartphone and the server to the same WIFI/wired network, and make sure that the files on the web server are accessible from the smartphone browser via HTTP.


# Running VR video streaming
This section introduces how to run the 360-degree video streaming system with the three modes: Default (original system without power optimization), QuRate_verbose (QuRate with frame rate output for observation), and QuRate (QuRate without output log for power measurements).

### General Procedure
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

Note:  we do not need to enter the VR mode to view the frame rate information, since the WebVR library starts working as soon as the page is loaded.

##### Method 2: "Remote devices" feature of Chrome
1. Open a Chrome browser on the computer.
1. Set up the "Remote devices" feature on Chrome following the instructions here (https://developers.google.com/web/tools/chrome-devtools/remote-debugging?utm_campaign=2016q3&utm_medium=redirect&utm_source=dcc).
1. Enable USB debugging on the smartphone following the instructions here: https://developer.android.com/studio/debug/dev-options.
1. Connect the smartphone and the computer using a USB cable.
1. Enter the VR mode and playback the VR video on the smartphone.
1. Observe the frame rate information from the console chrome browser.

Note: according to the design of QuRate, frame rate reduction occurs only when the smartphone is in motion (i.e., switching views).

### The QuRate Mode
In Step 3 above, choose a video from the QuRate list. This is the mode with QuRate enabled but without the frame rate output, intended for power evaluation without the potential power overhead caused by logging.  

# Power Measurements
This section describes how to measure and compare the power consumptions of "Default" and "QuRate" modes to demonstrate the effectiveness of QuRate in power-efficient VR streaming. 

1. Refer to the tuide of the Monsoon power monitor (https://msoon.github.io/powermonitor/PowerTool/doc/Power%20Monitor%20Manual.pdf) to connect the smartphone and the computer. **Please ensure that the smartphone is charged by the power monitor, not any cable.**  The power monitor can be controlled by the power tool application on the computer. 
1. The setup requires modification to the battery system of the smartphone. It will be easier if the smartphone has a removable battery (we have tested and would recommend LG V20, Samsung S7, Moto G5, and LG G4). The details can be found here: https://mostly-tech.com/tag/monsoon-power-monitor/.
1. Load the videos from the "Default" or "QuRate" list, with the same steps as described in previous section.
1. Compare the power consumption when playing the same video under the Default and QuRate modes.

Note: according to the design of QuRate, power reduction is more obvious to observe when the smartphone is constantly moving at high speed.


# Build and update frame rate library (FRL)

This section introduces the steps to build and update FRL. The details of those steps are also explained in Sections 4.3 and 5.2 of the paper.

As the WebVR supports both the HMD view and the browser view, the user's view experience in the HMD can be simulated using the browser view mode on a PC. We use this feature of WebVR and adopt some metrics to measure the user experience. Below are the details about how to build the FRL and how to apply the FRL in the JS code.


### Build FRL 

1. **Set up the video playback system on PC:** Set up the player using the `player/frl_update/frl_update.html`. Update the video index at Line 55 to change videos.
1. **Calculate and rank the user's angular speed:** Calculate the user's angular speed following Equation (9) from the paper.
1. **Adopt the user's movement in JS code:** Open `src/frl_update/frl_update.js`. Replace Lines 1296-1360 with the user's movement data. Update the value of `number` at Line 1310 as the total number of the data points.
1. **Record the video with the user's movement:** Play the video that needs to be updated with the "Full Screen" button on the browser. Record the video from the screen of PC using [this tool](https://www.apowersoft.com/#_wxga=GA1.2.1294387463.1586888792). Remember to play the video with full screen and make sure the recorded video only contains the user's view, temporal and spatial. Cut the video if necessary, using [this tool](https://online-video-cutter.com/).
1. **Calculate the video quality:** Follow the Equations (1) to (6) from the paper to calculate all the required parameters. The `TI` and `SI` can be calculated using [this tool](https://github.com/leixiaohua1020/TIandSI) 
1. **Build the FRL:** For each video, plot the "STVQM V.S. Frame rate" curves using selected users from the Step 2, like Figure 6 from the paper.

**Explanation** Since directly measure the video quality of the user's view is not possible, we record the user's view from the monitor of a PC, along with the user's head movement data. In this way, we are able to measure the video quality of the user's view.


### Apply FRL to the JS code


1. Find the JS code for the video that needs to be updated from `src/webvr_power_measurement/QuRate_videoX` (where videoX is the video index).
1. Update the value of `a` and the range of `velocity` between lines 1354 and 1358 accordingly, as described in the following steps.
1. Set an appropriate "STVQM Objective" score for each video as shown in Table 4 of the paper.
1. For each video, from the curves plotted in the last section, find the frame rate values of each user with the appropriate STVQM Objective score set in the last step, which will be the values of `a` in the JS code (also will be the last three columns in Table 4 of the paper). 
1. Again, for each video, find the angular speed of those users in the plot, which will be the corresponding `velocity` value to each `a` in the JS code.

**Explanation** The value of `a` controls the frame rate by skipping the view generation function `renderSceneView` being called, which is the implementation of Algorithm 1 from the paper. The parameter `velocity` calculates the user's angular speed, which is the implementation of Algorithm 2 from the paper.

# Known Issue

* The system may not work with all browsers. The provided chromium browser apk has been tested to work.
* The VR video playback may fail if the video is entered when the phone is in the horizontal mode. 

# License
MIT
