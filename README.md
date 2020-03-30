# QuRate Overview

QuRate is a quality-aware and user-centric frame rate adaptation mechanism to tackle the power consumption issue in immersive video streaming (a.k.a., 36-degree video streaming) on smartphones, which is described in our recently accepted MMSys 2020 paper:

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
       |-----webvr_fr_observation     // JS of QuRate for frame rate observation
       |-----webvr_original           // JS of original VR video playback
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
* An Android smartphone as the client.
* A computer as the server.
* [Power monitor](https://www.msoon.com/online-store) if need to measure the power. (Monsoon power monitor is tested and guaranteed to work)
* An HMD if need to view the VR video with a better experience.
* A cable to connect the smartphone with the computer if need to use the "Remote devices" feature of Chrome.

### Software Requirements
* Test videos (under the "video" folder of this repository) were obtained from the following dataset paper:

      Xavier Corbillon, Francesca De Simone, and Gwendal Simon, 360-Degree Video Head Movement Dataset. ACM Multimedia Systems Conference (MMSys), pp. 199–204, 2017. 
* A special version of Chromium browser `chromium_webvr_v1_android.apk` (under the "tool" folder of this repository).

# System Setup

1. Install the special version of Chromium `chromium_webvr_v1_android.apk` on the smartphone. (Provided version is tested and guaranteed to work. Some other browser maybe work as well.)
1. Setup a server on the computer. ([XAMPP](https://www.apachefriends.org/index.html) on Windows 10 and [Apache](https://httpd.apache.org/) on Linux system is tested and guaranteed to work. Other server setups should also work.)
1. Clone all the source files into the folder of the server on the computer. Make sure they can be accessed using the browser from the smartphone (i.e., Make sure the smartphone and the PC are in the same wireless connection).

# Testing & Evaluation

1. On smartphone, type `path-to-localhost-folder/QuRate.html` in URL bar of the Chromium.
1. Choose a video from "Original" or "QuRate(frame rate observation)" lists.
1. (**IMPORTANT**) Before playback, make sure the smartphone is vertical.
1. Click on "**LOAD PLAYER**", "**Play**", and "**Enter VR**" buttons in turns to enable VR video playback.
1. View the video in any HMD for better experience.
1. Exit the full screen mode. Click "**Back to play list**" button to go back to the play list for other videos.

# Observe Frame Rate Reduction
1. Choose any video from the "QuRate(frame rate observation)" list.
1. **Method 1**: before entering the VR mode, move the smartphone quickly and keep monitoring the number changing from the browser where it says, "Frame rate is XX FPS".
1. **Method 2**: enter the VR mode. Use the "Remote devices" feature of Chrome browser and read the console log from a computer. The detail of "Remote devices" is described below.

**NOTE**, in Method 1, you do not need to enter VR mode to view the frame rate change because the WebVR library is working once the page is loaded. However, it might be hard to catch the change by human eyes since the smartphone is moving back and forth quickly.

# "Remote devices" feature of Chrome
1. The steps of setting up the "Remote devices" feature on Chrome can be found in [this link](https://developers.google.com/web/tools/chrome-devtools/remote-debugging?utm_campaign=2016q3&utm_medium=redirect&utm_source=dcc).
1. Make sure the smartphone has debug mode enabled. Follow [this link](https://www.youtube.com/watch?v=Ucs34BkfPB0).
1. Connect smartphone and computer with cable.
1. Follow the steps in "Testing & Evaluation" to view the video from the "QuRate(frame rate observation)" list.
1. Observe the frame rate output in the console log of smartphone on computer.

# Power measurement

1. Refer to the [guide](https://msoon.github.io/powermonitor/PowerTool/doc/Power%20Monitor%20Manual.pdf) of the power monitor tool to connect the smartphone and computer. To do so, the smartphone will be charged by the power monitor, and the power monitor can be controlled by the power tool application on the computer. Setup details can be found in [this link](https://mostly-tech.com/tag/monsoon-power-monitor/).
1. Follow the steps in "Testing & Evaluation" to load the player list page.
1. Compare the power consumption of videos from "Original" or "QuRate(power measurement)" lists.

**NOTE**, power reduction is more obvious when the smartphone is constantly moving at high speed.

# Known Issue

* Might not work for all browsers. The provide browser apk is guaranteed to work.
* If enter the video with the phone in horizontal mode, playback might fail.

# License
MIT
