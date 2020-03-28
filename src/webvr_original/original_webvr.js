/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var define = false;
	
	__webpack_require__(1);



	
	document.addEventListener("DOMContentLoaded", function () {
	    document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
	});











/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var define = false;
	
	/*global require, module, window, document */
	
	'use strict';
	
	window.WebVRConfig = {
		BUFFER_SCALE: 0.5,
		CARDBOARD_UI_DISABLED: true
	};
	
	var OThreeSixty = __webpack_require__(2);
	
	function addScript(url) {
		var p = new Promise(function (resolve, reject) {
			var script = document.createElement('script');
			script.setAttribute('src', url);
			document.head.appendChild(script);
			script.onload = resolve;
			script.onerror = reject;
		});
		function promiseScript() {
			return p;
		};
		promiseScript.promise = p;
		return promiseScript;
	}
	
	var threePromise = undefined;
	if (window.THREE) {
		if (window.THREE.REVISION !== '78') {
			throw Error('Wrong version of three present');
		}
		threePromise = Promise.resolve();
	} else {
		threePromise = addScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r78/three.min.js').promise;
	}
	
	OThreeSixty.addScripts = function () {
		return Promise.all([addScript('https://cdn.rawgit.com/borismus/webvr-polyfill/v0.9.15/build/webvr-polyfill.js').promise, threePromise]);
	};
	
	var constructAll = function constructAll() {
		if (OThreeSixty.disableAutoInit) return;
		OThreeSixty.addScripts().then(function () {
			[].slice.call(document.querySelectorAll('[data-o-component~="o-three-sixty"]')).forEach(function (el) {
				new OThreeSixty(el);
			});
		});
	
		document.removeEventListener('o.DOMContentLoaded', constructAll);
	};
	document.addEventListener('o.DOMContentLoaded', constructAll);
	
	module.exports = OThreeSixty;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var define = false;
	
	/**
	 * Initialises an o-three-sixty components inside the element passed as the first parameter
	 *
	 * @param {(HTMLElement|string)} [el=document.body] - Element where to search for the o-three-sixty component. You can pass an HTMLElement or a selector string
	 * @returns {OThreeSixty} - A single OThreeSixty instance
	 */
	
	/*
	global document, HTMLElement, navigator
	*/
	'use strict';
	
	var oVideo = __webpack_require__(3);
	var ThreeSixtyMedia = __webpack_require__(13);
	
	function OThreeSixty(rootEl, opts) {
	
		if (!rootEl) {
			rootEl = document.body;
		} else if (!(rootEl instanceof HTMLElement)) {
			rootEl = document.querySelector(rootEl);
		}
		if (rootEl.getAttribute('data-o-component') === 'o-three-sixty') {
			this.rootEl = rootEl;
		} else {
			this.rootEl = rootEl.querySelector('[data-o-component~="o-three-sixty"]') || rootEl;
		}
		if (rootEl.querySelector('canvas')) {
			throw Error('OThreeSixty already instantiated on element. Canvas already present.');
		}
	
		if (this.rootEl !== undefined) {
			this.init(opts);
		}
	}
	/*
	function timer()
	{
		var vs=0;
		//var timer=0;
		//if 
		vs=vs+1;
		return vs;   
	}
	
	function viewswitch()
	{
		var vs=0;
		//var i=0;
		vs+=1;	
		setInterval("viewswitch();",1000);
		if (vs>50){vs=20};
		return vs;
	}
	*/
	
	OThreeSixty.prototype.init = function init() {
		var _this = this;
	
		var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
		//var views=viewswitch();
		opts.fov = opts.fov || this.rootEl.dataset.oThreeSixtyFov || 90;
		opts.longOffset = opts.longOffset || this.rootEl.dataset.oThreeSixtyLong || 0;
		opts.reticule = opts.reticule || this.rootEl.dataset.oThreeSixtyReticule || '';
		if (opts.allowNativeMediaInterpretation === undefined) {
			opts.allowNativeMediaInterpretation = this.rootEl.dataset.oThreeSixtyNativeMediaInterpretation;
		}
		if (opts.allowNativeMediaInterpretation === undefined) {
			opts.allowNativeMediaInterpretation = true;
		}
	
		this.webglPromise = Promise.resolve().then(function () {
			if ((_this.rootEl.dataset.oVideoSource || '').toLowerCase() === 'brightcove') {
				var _ret = (function () {
	
					// init o-video
					var oVideoWrapper = document.createElement('div');
					oVideoWrapper.dataset.oComponent = 'o-video';
	
					// Transfer o-video data
					Object.keys(_this.rootEl.dataset).forEach(function (k) {
						if (k.indexOf('oVideo') === 0) {
							oVideoWrapper.dataset[k] = _this.rootEl.dataset[k];
							delete _this.rootEl.dataset[k];
						}
					});
	
					_this.rootEl.appendChild(oVideoWrapper);
					opts.context = _this.rootEl;
					return {
						v: oVideo.init(opts).then(function (oV) {
							return _this.oVideo = oV;
						}).then(function () {
							var media = _this.rootEl.querySelector('video');
							if (!media) throw Error('No video element found');
							media.width = media.clientWidth;
							media.height = media.clientHeight;
						})
					};
				})();
	
				if (typeof _ret === 'object') return _ret.v;
			}
		}).then(function () {
	
			// find media
			var media = _this.rootEl.querySelector('video,img');
	
			if (!media) {
				throw Error('No Image or Video Element Loaded');
			}
	
			media.setAttribute('crossorigin', 'anonymous');
	
			// Ensure it has the dimension=360 for native support.
			var type = media.getAttribute('type') || '';
			if (type.indexOf('dimension=360;') === -1) {
				media.setAttribute('type', type + ';dimension=360;');
			}
	
			if (media.tagName === 'VIDEO') {
				media.setAttribute('webkit-playsinline', '');
			}
	
			_this.media = media;
	
			if (opts.allowNativeMediaInterpretation && navigator.userAgent.match(/samsung.* mobile vr/ig)) {
				throw Error('360 Video handled natively');
			} else {
	
				// use it to instantiate new ThreeSixtyMedia
				_this.threeSixtyMedia = new ThreeSixtyMedia(_this.rootEl, _this.media, opts);
	
				if (opts.reticule) {
					_this.threeSixtyMedia.addReticule({
						image: opts.reticule
					});
				}
	
				return _this.threeSixtyMedia;
			}
		});
	};
	
	OThreeSixty.prototype.addButton = function addButton(opts) {
		var _this2 = this;
	
		return this.webglPromise.then(function () {
			return _this2.threeSixtyMedia.addSpriteButton(opts);
		});
	};
	
	OThreeSixty.prototype.destroy = function destroy() {
		if (!this.oVideo && this.media) {
			this.rootEl.parentNode.insertBefore(this.media, this.rootEl);
		}
		if (this.threeSixtyMedia) this.threeSixtyMedia.destroy();
		this.rootEl.parentNode.removeChild(this.rootEl);
		delete this.rootEl;
		delete this.media;
		delete this.threeSixtyMedia;
	};
	
	module.exports = OThreeSixty;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(4);

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var define = false;
	
	var factory = __webpack_require__(5);
	
	function loadAdsLibrary() {
		return new Promise(function (resolve, reject) {
			var googleSdkScript = document.createElement('script');
			googleSdkScript.setAttribute('type', 'text/javascript');
			googleSdkScript.setAttribute('src', '//imasdk.googleapis.com/js/sdkloader/ima3.js');
			googleSdkScript.setAttribute('async', true);
			googleSdkScript.setAttribute('defer', true);
			document.getElementsByTagName("head")[0].appendChild(googleSdkScript);
	
			googleSdkScript.addEventListener('load', function () {
				resolve();
			});
	
			googleSdkScript.addEventListener('error', function () {
				reject();
			});
		});
	}
	
	function loadVideos(options) {
		var videoPromises = [].map.call(options.context.querySelectorAll(options.selector + ':not([data-o-video-js])[data-o-component~="o-video"]'), function (videoEl) {
			return factory(videoEl, options).init()
			// don't fail all if a video errors
			['catch'](function () {});
		});
	
		return Promise.all(videoPromises);
	}
	
	function init(opts) {
		var options = opts || {};
		var defaultOpts = {
			context: document.body,
			selector: '*'
		};
	
		for (var defaultOpt in defaultOpts) {
			if (defaultOpts.hasOwnProperty(defaultOpt) && !options.hasOwnProperty(defaultOpt)) {
				options[defaultOpt] = defaultOpts[defaultOpt];
			}
		}
	
		var librariesLoaded = options.advertising ? loadAdsLibrary() : Promise.resolve();
		options.context = options.context instanceof HTMLElement ? options.context : document.querySelector(opts.context);
	
		return librariesLoaded.then(function () {
			return loadVideos(options);
		}, function () {
			options.ads = false;
			return loadVideos(options);
		});
	};
	
	module.exports = {
		init: init,
		factory: factory,
		_loadAdsLibrary: loadAdsLibrary
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var define = false;
	
	var Video = __webpack_require__(6);
	var Brightcove = __webpack_require__(7);
	var VideoJsPlayer = __webpack_require__(12);
	
	module.exports = function (el, opts) {
		var source = el.getAttribute('data-o-video-source').toLowerCase();
		var player = (el.getAttribute('data-o-video-player') || 'html5').toLowerCase();
		if (source === 'brightcove') {
			if (player === 'videojs') {
				return new VideoJsPlayer(el, opts);
			}
			return new Brightcove(el, opts);
		} else {
			return new Video(el, opts);
		}
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var define = false;
	
	var Video = (function () {
		function Video(el, opts) {
			var _this = this;
	
			_classCallCheck(this, Video);
	
			this.containerEl = el;
			var defaultOpts = {
				advertising: false,
				classes: [],
				optimumWidth: null,
				placeholder: false,
				placeholderTitle: false,
				playButton: true,
				data: null
			};
			this.opts = {};
			Object.keys(defaultOpts).forEach(function (optionName) {
				var attributeName = optionName.replace(/[A-Z]/g, function (match) {
					return '-' + match.toLowerCase();
				});
				var optionAttribute = _this.containerEl.getAttribute('data-o-video-opts-' + attributeName);
				if (optionAttribute) {
					// parse as JSON, if 'data' attribute
					_this.opts[optionName] = optionName === 'data' ? JSON.parse(optionAttribute) : optionAttribute;
				} else if (opts && typeof opts[optionName] !== 'undefined') {
					_this.opts[optionName] = opts[optionName];
				} else {
					_this.opts[optionName] = defaultOpts[optionName];
				}
			});
			this.classes = typeof this.opts.classes === 'string' ? this.opts.classes.split(' ') : this.opts.classes.slice();
			this.classes.push('o-video__video');
			this.id = el.getAttribute('data-o-video-id');
			this.el;
			this.placeholderEl;
			this.containerEl.setAttribute('data-o-video-js', '');
		}
	
		_createClass(Video, [{
			key: 'init',
			value: function init() {
				return Promise.resolve(this);
			}
		}]);
	
		return Video;
	})();
	
	module.exports = Video;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var define = false;
	
	/* global fetch, google */
	var crossDomainFetch = __webpack_require__(8).crossDomainFetch;
	var Video = __webpack_require__(6);
	var getAppropriateRendition = __webpack_require__(10);
	
	var currentlyPlayingVideo = null;
	var requestedVideo = null;
	
	var pauseOtherVideos = function pauseOtherVideos(video) {
		requestedVideo = video;
		if (currentlyPlayingVideo && currentlyPlayingVideo !== requestedVideo) {
			currentlyPlayingVideo.pause();
		}
	
		currentlyPlayingVideo = video;
	};
	
	var clearCurrentlyPlaying = function clearCurrentlyPlaying() {
		if (currentlyPlayingVideo !== requestedVideo) {
			currentlyPlayingVideo = null;
		}
	};
	
	var eventListener = function eventListener(video, ev) {
		var event = new CustomEvent('oTracking.event', {
			detail: {
				action: 'media',
				advertising: video.opts.advertising,
				category: 'video',
				event: ev.type,
				mediaType: 'video',
				contentId: video.id,
				progress: video.getProgress()
			},
			bubbles: true
		});
		document.body.dispatchEvent(event);
	};
	
	var addEvents = function addEvents(video, events) {
		events.forEach(function (event) {
			video.el.addEventListener(event, eventListener.bind(undefined, video));
		});
	};
	
	// use the image resizing service, if width supplied
	var updatePosterUrl = function updatePosterUrl(posterImage, width) {
		var url = 'https://image.webservices.ft.com/v1/images/raw/' + encodeURIComponent(posterImage) + '?source=o-video';
		if (width) {
			url += '&fit=scale-down&width=' + width;
		}
		return url;
	};
	
	var Brightcove = (function (_Video) {
		_inherits(Brightcove, _Video);
	
		function Brightcove(el, opts) {
			_classCallCheck(this, Brightcove);
	
			_get(Object.getPrototypeOf(Brightcove.prototype), 'constructor', this).call(this, el, opts);
			this.targeting = {
				site: '/5887/ft.com',
				position: 'video',
				sizes: '592x333|400x225',
				videoId: this.id
			};
		}
	
		_createClass(Brightcove, [{
			key: 'getData',
			value: function getData() {
				var _this = this;
	
				var dataPromise = this.opts.data ? Promise.resolve(this.opts.data) : crossDomainFetch('//next-video.ft.com/api/' + this.id).then(function (response) {
					if (response.ok) {
						return response.json();
					} else {
						throw Error('Brightcove responded with a ' + response.status + ' (' + response.statusText + ') for id ' + _this.id);
					}
				});
	
				return dataPromise.then(function (data) {
					_this.brightcoveData = data;
					_this.posterImage = updatePosterUrl(data.videoStillURL, _this.opts.optimumWidth);
					_this.rendition = getAppropriateRendition(data.renditions);
				});
			}
		}, {
			key: 'renderVideo',
			value: function renderVideo() {
				if (this.rendition) {
					if (this.opts.placeholder) {
						this.addPlaceholder();
					} else {
						this.addVideo();
					}
				}
				return this;
			}
		}, {
			key: 'init',
			value: function init() {
				var _this2 = this;
	
				return this.getData().then(function () {
					return _this2.renderVideo();
				});
			}
		}, {
			key: 'info',
			value: function info() {
				var date = new Date(+this.brightcoveData.publishedDate);
				return {
					posterImage: this.posterImage,
					id: this.brightcoveData.id,
					length: this.brightcoveData.length,
					longDescription: this.brightcoveData.longDescription,
					name: this.brightcoveData.name,
					publishedDate: date.toISOString(),
					publishedDateReadable: date.toUTCString(),
					shortDescription: this.brightcoveData.shortDescription,
					tags: this.brightcoveData.tags
				};
			}
		}, {
			key: 'setUpAds',
			value: function setUpAds() {
				this.adContainerEl = document.createElement('div');
				this.containerEl.appendChild(this.adContainerEl);
				this.adDisplayContainer = new google.ima.AdDisplayContainer(this.adContainerEl, this.el);
	
				// Create ads loader.
				this.adsLoader = new google.ima.AdsLoader(this.adDisplayContainer);
	
				// Sets up bindings for all Ad related handlers
				this.adsManagerLoadedHandler = this.adsManagerLoadedHandler.bind(this);
				this.adErrorHandler = this.adErrorHandler.bind(this);
				this.adEventHandler = this.adEventHandler.bind(this);
				this.contentPauseRequestHandler = this.contentPauseRequestHandler.bind(this);
				this.contentResumeRequestHandler = this.contentResumeRequestHandler.bind(this);
	
				// Listen and respond to ads loaded and error events.
				this.adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this.adsManagerLoadedHandler, false);
				this.adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.adErrorHandler, false);
	
				// Request video ads.
				var adsRequest = new google.ima.AdsRequest();
				var advertisingUrl = 'http://pubads.g.doubleclick.net/gampad/ads?env=vp&gdfp_req=1&impl=s&output=xml_vast2&iu=' + this.targeting.site + '&sz=' + this.targeting.sizes + '&unviewed_position_start=1&scp=pos%3D' + this.targeting.position + '&ttid=' + this.targeting.videoId;
				if (this.targeting.brand) {
					advertisingUrl += '&brand=' + encodeURIComponent(this.targeting.brand);
				}
	
				adsRequest.adTagUrl = advertisingUrl;
	
				// Specify the linear and nonlinear slot sizes. This helps the SDK to
				// select the correct creative if multiple are returned.
				adsRequest.linearAdSlotWidth = 592;
				adsRequest.linearAdSlotHeight = 333;
	
				adsRequest.nonLinearAdSlotWidth = 592;
				adsRequest.nonLinearAdSlotHeight = 150;
	
				this.adsLoader.requestAds(adsRequest);
			}
		}, {
			key: 'addVideo',
			value: function addVideo() {
				var _this3 = this;
	
				this.el = document.createElement('video');
				this.el.setAttribute('controls', true);
				this.el.setAttribute('poster', this.posterImage);
				this.el.setAttribute('src', this.rendition.url);
				this.el.className = Array.isArray(this.classes) ? this.classes.join(' ') : this.classes;
				this.containerEl.classList.add('o-video--player');
				this.containerEl.appendChild(this.el);
				addEvents(this, ['play', 'pause', 'ended']);
				this.el.addEventListener('playing', function () {
					return pauseOtherVideos(_this3.el);
				});
				this.el.addEventListener('suspend', clearCurrentlyPlaying);
				this.el.addEventListener('ended', clearCurrentlyPlaying);
	
				if (this.opts.advertising) {
					this.setUpAds();
				}
			}
		}, {
			key: 'addPlaceholder',
			value: function addPlaceholder() {
				var _this4 = this;
	
				this.placeholderEl = document.createElement('img');
				this.placeholderEl.setAttribute('src', this.posterImage);
				this.placeholderEl.classList.add('o-video__placeholder');
				this.containerEl.appendChild(this.placeholderEl);
	
				var titleEl = undefined;
				if (this.opts.placeholderTitle) {
					titleEl = document.createElement('div');
					titleEl.className = 'o-video__title';
					titleEl.textContent = this.brightcoveData.name;
					this.containerEl.appendChild(titleEl);
				}
	
				if (this.opts.playButton) {
					(function () {
						var playButtonEl = document.createElement('button');
						playButtonEl.className = 'o-video__play-button';
	
						var playButtonTextEl = document.createElement('dd');
						playButtonTextEl.className = 'o-video__play-button-text';
						playButtonTextEl.textContent = 'Play video';
						playButtonEl.appendChild(playButtonTextEl);
	
						var playIconEl = document.createElement('i');
						playIconEl.className = 'o-video__play-button-icon';
						playButtonEl.appendChild(playIconEl);
	
						_this4.containerEl.appendChild(playButtonEl);
	
						playButtonEl.addEventListener('click', function () {
							_this4.containerEl.removeChild(playButtonEl);
							if (titleEl) {
								_this4.containerEl.removeChild(titleEl);
							}
							_this4.containerEl.removeChild(_this4.placeholderEl);
	
							_this4.el.style.display = 'block';
							_this4.el.play();
							_this4.el.focus();
						});
					})();
				}
	
				// Adds video soon so ads can start loading
				this.addVideo();
				// Hide it so it doesn't flash until the placeholder image loads
				this.el.style.display = 'none';
			}
		}, {
			key: 'getProgress',
			value: function getProgress() {
				return this.el.duration ? parseInt(100 * this.el.currentTime / this.el.duration, 10) : 0;
			}
		}, {
			key: 'playAdEventHandler',
			value: function playAdEventHandler() {
				// Sets the styling now so the ad occupies the space of the video
				this.adContainerEl.classList.add('o-video__ad');
				// Initialize the video. Must be done via a user action on mobile devices.
				this.el.load();
				this.adDisplayContainer.initialize();
	
				try {
					// Initialize the ads manager. Ad rules playlist will start at this time.
					this.adsManager.init(this.el.clientWidth, this.el.clientHeight, google.ima.ViewMode.NORMAL);
					// Call play to start showing the ad. Single video and overlay ads will
					// start at this time; the call will be ignored for ad rules.
					this.adsManager.start();
				} catch (adError) {
					// An error may be thrown if there was a problem with the VAST response.
					this.el.play();
				}
	
				this.el.removeEventListener('play', this.playAdEventHandler);
			}
		}, {
			key: 'adsManagerLoadedHandler',
			value: function adsManagerLoadedHandler(adsManagerLoadedEvent) {
				// If the video has started before the ad loaded, don't load the ad
				if (this.el.played.length > 0) {
					return;
				}
				// Get the ads manager.
				var adsRenderingSettings = new google.ima.AdsRenderingSettings();
				adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
				this.adsManager = adsManagerLoadedEvent.getAdsManager(this.el, adsRenderingSettings);
	
				// Add listeners to the required events.
				this.adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.adErrorHandler);
				this.adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, this.contentPauseRequestHandler);
				this.adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, this.contentResumeRequestHandler);
				this.adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, this.adEventHandler);
	
				// Listen to any additional events, if necessary.
				this.adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, this.adEventHandler);
				this.adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, this.adEventHandler);
				this.adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, this.adEventHandler);
	
				this.playAdEventHandler = this.playAdEventHandler.bind(this);
				this.el.addEventListener('play', this.playAdEventHandler);
			}
		}, {
			key: 'adEventHandler',
			value: function adEventHandler(adEvent) {
				// Retrieve the ad from the event. Some events (e.g. ALL_ADS_COMPLETED)
				// don't have ad object associated.
				var ad = adEvent.getAd();
				var intervalTimer = undefined;
				switch (adEvent.type) {
					case google.ima.AdEvent.Type.LOADED:
						// This is the first event sent for an ad - it is possible to
						// determine whether the ad is a video ad or an overlay.
						if (!ad.isLinear()) {
							// Position AdDisplayContainer correctly for overlay.
							// Use ad.width and ad.height.
							this.el.play();
						}
						break;
					case google.ima.AdEvent.Type.STARTED:
						// This event indicates the ad has started - the video player
						// can adjust the UI, for example display a pause button and
						// remaining time.
						if (ad.isLinear()) {
							// For a linear ad, a timer can be started to poll for
							// the remaining time.
							intervalTimer = setInterval(function () {
								// Currently not used
								// const remainingTime = this.adsManager.getRemainingTime();
							}, 300); // every 300ms
						}
						break;
					case google.ima.AdEvent.Type.COMPLETE:
						this.adContainerEl.style.display = 'none';
						if (ad.isLinear()) {
							clearInterval(intervalTimer);
						}
						break;
				}
			}
		}, {
			key: 'adErrorHandler',
			value: function adErrorHandler() {
				// Handle the error logging.
				this.adsManager.destroy();
			}
		}, {
			key: 'contentPauseRequestHandler',
			value: function contentPauseRequestHandler() {
				this.el.pause();
			}
		}, {
			key: 'contentResumeRequestHandler',
			value: function contentResumeRequestHandler() {
				this.containerEl.removeChild(this.adContainerEl);
				this.el.play();
			}
		}]);
	
		return Brightcove;
	})(Video);
	
	module.exports = Brightcove;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(9);

/***/ },
/* 9 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	var define = false;
	
	var jsonpCallbackNames = [];
	
	var generateCallbackName = function generateCallbackName() {
		var base = 'jsonpCallback';
		var callbackName = base + '_' + (jsonpCallbackNames.length + 1);
		jsonpCallbackNames.push(callbackName);
		return callbackName;
	};
	
	var crossDomainFetch = function crossDomainFetch() {
		var crossDomainFetch = 'withCredentials' in new XMLHttpRequest() ? fetch : jsonpFetch;
		return crossDomainFetch.apply(undefined, arguments);
	};
	
	var jsonpFetch = function jsonpFetch(url, opts) {
		var defaultOpts = {
			timeout: 2000
		};
		opts = opts || {};
		Object.keys(defaultOpts).forEach(function (defaultOptsKey) {
			if (!opts.hasOwnProperty(defaultOptsKey)) {
				opts[defaultOptsKey] = defaultOpts[defaultOptsKey];
			}
		});
		return new Promise(function (resolve, reject) {
			var callbackName = generateCallbackName();
			var timeout = undefined;
			window.FT = window.FT || {};
			window.FT[callbackName] = function (response) {
				var status = response.status ? response.status : 200;
				resolve({
					ok: Math.floor(status / 100) === 2,
					status: status,
					json: function json() {
						return Promise.resolve(response.body || response);
					}
				});
				if (timeout) {
					clearTimeout(timeout);
				}
			};
	
			var scriptTag = document.createElement('script');
			scriptTag.defer = true;
			scriptTag.src = '' + url + (url.indexOf('?') > -1 ? '&' : '?') + 'callback=FT.' + callbackName;
			document.body.appendChild(scriptTag);
	
			timeout = setTimeout(function () {
				reject(new Error('JSONP request to ' + url + ' timed out'));
			}, opts.timeout);
		});
	};
	
	exports['default'] = jsonpFetch;
	exports.crossDomainFetch = crossDomainFetch;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var define = false;
	
	var supportedFormats = __webpack_require__(11);
	
	module.exports = function (renditions, options) {
		// allow mocking of supported formats module
		var opts = options || {};
		var width = opts.width;
		var formats = opts.supportedFormats || supportedFormats;
		var appropriateRendition = undefined;
		// order smallest to largest
		var orderedRenditions = renditions.filter(function (rendition) {
			return formats.indexOf(rendition.videoCodec.toLowerCase()) > -1;
		}).sort(function (renditionOne, renditionTwo) {
			return renditionOne.frameWidth - renditionTwo.frameWidth;
		});
	
		// if no width supplied, get largest
		if (!width) {
			return orderedRenditions.pop();
		}
		// NOTE: rather use find...
		orderedRenditions.some(function (rendition) {
			if (rendition.frameWidth >= width) {
				appropriateRendition = rendition;
				return true;
			}
			return false;
		});
	
		return appropriateRendition || orderedRenditions.shift();
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var define = false;
	
	var testEl = document.createElement('video');
	
	var formats = {
		mpeg4: ['video/mp4; codecs="mp4v.20.8"'],
		h264: ['video/mp4; codecs="avc1.42E01E"', 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'],
		ogg: ['video/ogg; codecs="theora"'],
		webm: ['video/webm; codecs="vp8, vorbis"']
	};
	
	var supportedFormats = [];
	if (testEl.canPlayType) {
		try {
			supportedFormats = Object.keys(formats).filter(function (format) {
				return formats[format].some(function (type) {
					return testEl.canPlayType(type);
				});
			});
		} catch (e) {}
	}
	
	module.exports = supportedFormats;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var define = false;
	
	/* global fetch, videojs */
	
	var crossDomainFetch = __webpack_require__(8).crossDomainFetch;
	var Video = __webpack_require__(6);
	var getAppropriateRendition = __webpack_require__(10);
	
	var currentlyPlayingVideo = null;
	var requestedVideo = null;
	var videoJsPromise = undefined;
	var videoJsPluginsPromise = undefined;
	var videoElementIdOrder = 0;
	var advertising = undefined;
	
	var pauseOtherVideos = function pauseOtherVideos(video) {
		requestedVideo = video;
		if (currentlyPlayingVideo && currentlyPlayingVideo !== requestedVideo) {
			currentlyPlayingVideo.pause();
		}
	
		currentlyPlayingVideo = video;
	};
	
	var ensureVideoJsLibraryLoaded = function ensureVideoJsLibraryLoaded() {
		if (videoJsPromise) {
			return videoJsPromise;
		}
	
		var videojsScript = document.createElement('script');
		videojsScript.setAttribute('type', 'text/javascript');
		videojsScript.setAttribute('src', '//vjs.zencdn.net/5.9.2/video.min.js');
		videojsScript.setAttribute('async', true);
		videojsScript.setAttribute('defer', true);
		document.getElementsByTagName("head")[0].appendChild(videojsScript);
	
		var videojsStyles = document.createElement('link');
		videojsStyles.setAttribute('rel', 'stylesheet');
		videojsStyles.setAttribute('type', 'text/css');
		videojsStyles.setAttribute('href', '//vjs.zencdn.net/5.9.2/video-js.min.css');
		document.getElementsByTagName('head')[0].appendChild(videojsStyles);
	
		videoJsPromise = new Promise(function (resolve) {
			videojsScript.addEventListener('load', function () {
				resolve();
			});
		});
	
		return videoJsPromise;
	};
	
	var ensureVideoJsPluginsAreLoaded = function ensureVideoJsPluginsAreLoaded() {
		if (videoJsPluginsPromise) {
			return videoJsPluginsPromise;
		}
	
		if (advertising) {
			var _ret = (function () {
				var videoJsAdPluginsScript = document.createElement('script');
				videoJsAdPluginsScript.setAttribute('type', 'text/javascript');
				videoJsAdPluginsScript.setAttribute('src', 'https://next-geebee.ft.com/assets/videojs/videojs-plugins.min.js');
				videoJsAdPluginsScript.setAttribute('async', true);
				videoJsAdPluginsScript.setAttribute('defer', true);
				document.getElementsByTagName("head")[0].appendChild(videoJsAdPluginsScript);
	
				var videoJsAdPluginsScriptPromise = new Promise(function (pluginsLoaded) {
					videoJsAdPluginsScript.addEventListener('load', function () {
						pluginsLoaded();
					});
				});
	
				var videoJsAdPluginStyles = document.createElement('link');
				videoJsAdPluginStyles.setAttribute('rel', 'stylesheet');
				videoJsAdPluginStyles.setAttribute('type', 'text/css');
				videoJsAdPluginStyles.setAttribute('href', 'https://next-geebee.ft.com/assets/videojs/videojs-plugins.min.css');
				document.getElementsByTagName('head')[0].appendChild(videoJsAdPluginStyles);
				videoJsPluginsPromise = Promise.all([videoJsAdPluginsScriptPromise]);
				return {
					v: videoJsPluginsPromise
				};
			})();
	
			if (typeof _ret === 'object') return _ret.v;
		} else {
			return Promise.resolve();
		}
	};
	
	var ensureAllScriptsAreLoaded = function ensureAllScriptsAreLoaded() {
		return ensureVideoJsLibraryLoaded().then(function () {
			return ensureVideoJsPluginsAreLoaded();
		});
	};
	
	// use the image resizing service, if width supplied
	var updatePosterUrl = function updatePosterUrl(posterImage, width) {
		var url = 'https://image.webservices.ft.com/v1/images/raw/' + encodeURIComponent(posterImage) + '?source=o-video';
		if (width) {
			url += '&fit=scale-down&width=' + width;
		}
		return url;
	};
	
	var VideoJsPlayer = (function (_Video) {
		_inherits(VideoJsPlayer, _Video);
	
		function VideoJsPlayer(el, opts) {
			_classCallCheck(this, VideoJsPlayer);
	
			advertising = opts && opts['advertising'] ? true : false;
			ensureAllScriptsAreLoaded();
			_get(Object.getPrototypeOf(VideoJsPlayer.prototype), 'constructor', this).call(this, el, opts);
			this.targeting = {
				site: '/5887/ft.com',
				position: 'video',
				sizes: '592x333|400x225',
				videoId: this.id
			};
		}
	
		_createClass(VideoJsPlayer, [{
			key: 'getData',
			value: function getData() {
				var _this = this;
	
				var dataPromise = this.opts.data ? Promise.resolve(this.opts.data) : crossDomainFetch('//next-video.ft.com/api/' + this.id).then(function (response) {
					if (response.ok) {
						return response.json();
					} else {
						throw Error('Brightcove responded with a ' + response.status + ' (' + response.statusText + ') for id ' + _this.id);
					}
				});
	
				return dataPromise.then(function (data) {
					_this.brightcoveData = data;
					_this.posterImage = updatePosterUrl(data.videoStillURL, _this.opts.optimumWidth);
					_this.rendition = getAppropriateRendition(data.renditions);
					_this.targeting.brand = _this.getVideoBrand();
				});
			}
		}, {
			key: 'renderVideo',
			value: function renderVideo() {
				if (this.rendition) {
					if (this.opts.placeholder) {
						this.addPlaceholder();
					} else {
						this.addVideo();
					}
				}
				return this;
			}
		}, {
			key: 'init',
			value: function init() {
				var _this2 = this;
	
				var initPromise = this.getData().then(function () {
					return _this2.renderVideo();
				});
				return Promise.all([initPromise, videoJsPromise]);
			}
		}, {
			key: 'info',
			value: function info() {
				var date = new Date(+this.brightcoveData.publishedDate);
				return {
					posterImage: this.posterImage,
					id: this.brightcoveData.id,
					length: this.brightcoveData.length,
					longDescription: this.brightcoveData.longDescription,
					name: this.brightcoveData.name,
					publishedDate: date.toISOString(),
					publishedDateReadable: date.toUTCString(),
					shortDescription: this.brightcoveData.shortDescription,
					tags: this.brightcoveData.tags
				};
			}
		}, {
			key: 'addVideo',
			value: function addVideo() {
				var _this3 = this;
	
				var videoIdProperty = 'test-video-' + videoElementIdOrder++;
				this.el = document.createElement('video');
				this.el.setAttribute('poster', this.posterImage);
				this.el.setAttribute('src', this.rendition.url);
				this.el.setAttribute('id', videoIdProperty);
				this.el.className = Array.isArray(this.classes) ? this.classes.join(' ') : this.classes;
				this.el.classList.add('o-video--videojs');
				this.containerEl.appendChild(this.el);
				this.el.addEventListener('playing', function () {
					return pauseOtherVideos(_this3.el);
				});
				return ensureAllScriptsAreLoaded().then(function () {
					var videoPlayer = videojs(videoIdProperty, { "controls": true, "autoplay": true, "preload": "auto" }).width('100%');
					if (advertising) {
						_this3.advertising(videoPlayer, videoIdProperty);
					}
				});
			}
		}, {
			key: 'getVideoBrand',
			value: function getVideoBrand() {
				if (!this.brightcoveData.tags || this.brightcoveData.tags.length === 0) {
					return false;
				} else {
					var filtered = this.brightcoveData.tags.filter(function (val) {
						return val.toLowerCase().indexOf('brand:') !== -1;
					});
					if (filtered.length > 0) {
						try {
							// when we target the value in the ad server, we only want to target actual brand name, so we strip out "brand:" part of the string
							return filtered.pop().substring(6);
						} catch (e) {
							return false;
						}
					} else {
						return false;
					}
				}
			}
		}, {
			key: 'advertising',
			value: function advertising(player, videoIdProperty) {
				// ad server request call that contains ad server details such as: site(iu), sizes(sz), position(pos), video id(ttid) and branding(brand) if it is available
				// these key values are then used on ad server to target pre roll advertising
				var advertisingUrl = 'http://pubads.g.doubleclick.net/gampad/ads?env=vp&gdfp_req=1&impl=s&output=xml_vast2&iu=' + this.targeting.site + '&sz=' + this.targeting.sizes + '&unviewed_position_start=1&scp=pos%3D' + this.targeting.position + '&ttid=' + this.targeting.videoId;
				if (this.targeting.brand) {
					advertisingUrl += '&brand=' + encodeURIComponent(this.targeting.brand);
				}
	
				player.ima({
					id: videoIdProperty,
					adTagUrl: advertisingUrl
				});
				player.ima.requestAds();
			}
		}, {
			key: 'addPlaceholder',
			value: function addPlaceholder() {
				var _this4 = this;
	
				this.placeholderEl = document.createElement('img');
				this.placeholderEl.setAttribute('src', this.posterImage);
				this.placeholderEl.className = Array.isArray(this.classes) ? this.classes.join(' ') : this.classes;
				this.containerEl.classList.add('o-video--placeholder');
	
				this.containerEl.appendChild(this.placeholderEl);
	
				var titleEl = undefined;
				if (this.opts.placeholderTitle) {
					titleEl = document.createElement('div');
					titleEl.className = 'o-video__title';
					titleEl.textContent = this.brightcoveData.name;
					this.containerEl.appendChild(titleEl);
				}
	
				if (this.opts.playButton) {
					(function () {
	
						var playButtonEl = document.createElement('button');
						playButtonEl.className = 'o-video__play-button';
						_this4.containerEl.appendChild(playButtonEl);
	
						var playIconEl = document.createElement('i');
						playIconEl.className = 'o-video__play-button-icon';
						playButtonEl.appendChild(playIconEl);
	
						playButtonEl.addEventListener('click', function () {
							_this4.containerEl.removeChild(playButtonEl);
							if (titleEl) {
								_this4.containerEl.removeChild(titleEl);
							}
							_this4.removePlaceholder();
							_this4.addVideo();
							_this4.el.focus();
						});
					})();
				}
			}
		}, {
			key: 'removePlaceholder',
			value: function removePlaceholder() {
				this.containerEl.classList.remove('o-video--placeholder');
				this.containerEl.removeChild(this.placeholderEl);
			}
		}]);
	
		return VideoJsPlayer;
	})(Video);
	
	module.exports = VideoJsPlayer;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/'use strict';var _bind=Function.prototype.bind;var _createClass=(function(){function defineProperties(target,props){for(var i=0;i < props.length;i++) {var descriptor=props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if('value' in descriptor)descriptor.writable = true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};})();function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i < arr.length;i++) arr2[i] = arr[i];return arr2;}else {return Array.from(arr);}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}var define=false;'use strict'; /* global document, navigator, window, cancelAnimationFrame, requestAnimationFrame, THREE */var throttle=__webpack_require__(14).throttle;var spriteScale=0.05;var DEG2RAD=Math.PI / 180.0;var CameraInteractivityWorld=__webpack_require__(15);var rotWorldMatrix=undefined;var xAxis=undefined;var yAxis=undefined;var zAxis=undefined; //========================================
	
	var a=7;
	var counter=1;
	var flag=1;
	var old_time=new Date().getTime(); 
	var velocity = 10;
	var old_orientation = [0.001,0.001,0.001,1];
    
     //========================================
	function noop(){} // from THREE.js
	function fovToNDCScaleOffset(fov){var pxscale=2.0 / (fov.leftTan + fov.rightTan);var pxoffset=(fov.leftTan - fov.rightTan) * pxscale * 0.5;var pyscale=2.0 / (fov.upTan + fov.downTan);var pyoffset=(fov.upTan - fov.downTan) * pyscale * 0.5;return {scale:[pxscale,pyscale],offset:[pxoffset,pyoffset]};} // from THREE.js
	function fovPortToProjection(fov,rightHanded,zNear,zFar){rightHanded = rightHanded === undefined?true:rightHanded;zNear = zNear === undefined?0.01:zNear;zFar = zFar === undefined?10000.0:zFar;var handednessScale=rightHanded?-1.0:1.0; // start with an identity matrix
	var mobj=new THREE.Matrix4();var m=mobj.elements; // and with scale/offset info for normalized device coords
	var scaleAndOffset=fovToNDCScaleOffset(fov); // X result, map clip edges to [-w,+w]
	m[0 * 4 + 0] = scaleAndOffset.scale[0];m[0 * 4 + 1] = 0.0;m[0 * 4 + 2] = scaleAndOffset.offset[0] * handednessScale;m[0 * 4 + 3] = 0.0; // Y result, map clip edges to [-w,+w]
	// Y offset is negated because this proj matrix transforms from world coords with Y=up,
	// but the NDC scaling has Y=down (thanks D3D?)
	m[1 * 4 + 0] = 0.0;m[1 * 4 + 1] = scaleAndOffset.scale[1];m[1 * 4 + 2] = -scaleAndOffset.offset[1] * handednessScale;m[1 * 4 + 3] = 0.0; // Z result (up to the app)
	m[2 * 4 + 0] = 0.0;m[2 * 4 + 1] = 0.0;m[2 * 4 + 2] = zFar / (zNear - zFar) * -handednessScale;m[2 * 4 + 3] = zFar * zNear / (zNear - zFar); // W result (= Z in)
	m[3 * 4 + 0] = 0.0;m[3 * 4 + 1] = 0.0;m[3 * 4 + 2] = handednessScale;m[3 * 4 + 3] = 0.0;mobj.transpose();return mobj;}function rotateAroundWorldAxis(object,axis,radians){rotWorldMatrix.makeRotationAxis(axis.normalize(),radians);rotWorldMatrix.multiply(object.matrix);object.matrix = rotWorldMatrix;object.rotation.setFromRotationMatrix(object.matrix);} // from THREE.js
	function fovToProjection(fov,rightHanded,zNear,zFar){var fovPort={upTan:Math.tan(fov.upDegrees * DEG2RAD),downTan:Math.tan(fov.downDegrees * DEG2RAD),leftTan:Math.tan(fov.leftDegrees * DEG2RAD),rightTan:Math.tan(fov.rightDegrees * DEG2RAD)};return fovPortToProjection(fovPort,rightHanded,zNear,zFar);}var ThreeSixtyMedia=(function(){function ThreeSixtyMedia(container,media,opts){var _this=this;_classCallCheck(this,ThreeSixtyMedia);if(!THREE){throw Error('Threee.js required.');}if(!rotWorldMatrix){rotWorldMatrix = new THREE.Matrix4();xAxis = new THREE.Vector3(1,0,0);yAxis = new THREE.Vector3(0,1,0);zAxis = new THREE.Vector3(0,0,1);}this.listeners = [];var video=undefined;if(media.tagName === 'VIDEO'){video = media;this.video = video;}var preserveDrawingBuffer=false;this.buttonContainer = document.createElement('div');this.buttonContainer.classList.add('button-container');this.longOffset = opts.longOffset;container.classList.add('o-three-sixty-container');container.appendChild(this.buttonContainer);this.container = container;if(navigator.getVRDisplays){navigator.getVRDisplays().then(function(displays){if(displays.length > 0){_this.vrDisplay = displays[0];_this.addUiButton('Reset','R',null,function(){this.vrDisplay.resetPose();});if(_this.vrDisplay.capabilities.canPresent)_this.vrPresentButton = _this.addUiButton('Enter VR','E','cardboard-icon',_this.onVRRequestPresent);_this.addEventListener(window,'vrdisplaypresentchange',function(){return _this.onVRPresentChange();},false);}});preserveDrawingBuffer = true;}else if(navigator.getVRDevices){console.error('Your browser supports WebVR but not the latest version. See <a href=\'http://webvr.info\'>webvr.info</a> for more info.');}else {console.error('Your browser does not support WebVR. See <a href=\'http://webvr.info\'>webvr.info</a> for assistance.');}this.vrDisplay = null;this.vrPresentButton;media.style.display = 'none';this.media = media;this.fov = opts.fov || 90;this.camera = new THREE.PerspectiveCamera(this.fov,this.media.width / this.media.height,0.05,10000);this.camera.up.set(0,0,1);this.scene = new THREE.Scene();this.orientation = new THREE.Quaternion([0,0,0,1]);this.textureLoader = new THREE.TextureLoader();var renderer=new THREE.WebGLRenderer({antialias:false,preserveDrawingBuffer:preserveDrawingBuffer});renderer.context.disable(renderer.context.DEPTH_TEST);renderer.setPixelRatio(Math.floor(window.devicePixelRatio));renderer.autoClear = false;container.appendChild(renderer.domElement);this.renderer = renderer;this.cameraInteractivityWorld = new CameraInteractivityWorld(renderer.domElement,THREE);setTimeout(this.resize.bind(this),100);this.addFullscreenButton();this.addGeometry();this.startAnimation();this.addEventListener(this.renderer.domElement,'touchmove',function(e){e.preventDefault();return false;});if(video){(function(){if(video.readyState >= 2){_this.loadVideoTexture();_this.addPlayButton();}else {_this.addEventListener(video,'canplay',(function oncanplay(){video.removeEventListener('canplay',oncanplay);this.loadVideoTexture();this.addPlayButton();}).bind(_this));}var lastClick=undefined;_this.addEventListener(_this.renderer.domElement,'mousedown',function(){lastClick = Date.now();});_this.addEventListener(_this.renderer.domElement,'click',function(e){if(Date.now() - lastClick >= 300)return;if(!_this.hasVideoTexture)return;e.preventDefault();if(_this.video.paused){_this.updateTexture(_this.videoTexture);_this.video.play();_this.removeButton(_this.playButton);_this.playButton = null;}else {_this.addPlayButton();_this.video.pause();}});})();}}_createClass(ThreeSixtyMedia,[{key:'addSpriteButton',value:function addSpriteButton(_ref){var _this2=this;var image=_ref.image;var width=_ref.width;var height=_ref.height;var _ref$callback=_ref.callback;var callback=_ref$callback === undefined?noop:_ref$callback;if(this.buttons === undefined){this.buttons = [];}if(this.buttonArea === undefined){(function(){var buttonArea=new THREE.Object3D();buttonArea.position.set(0,-2,0);_this2.scene.add(buttonArea);_this2.buttonArea = buttonArea;buttonArea.goalRotationY = 0;buttonArea.checkInRange = throttle(function(){var v=new THREE.Vector3(0,0,-1);v.applyQuaternion(_this2.camera.quaternion);v.projectOnPlane(yAxis);var angle=-Math.PI / 2 - Math.atan2(v.z,v.x);if(Math.abs(buttonArea.goalRotationY - angle) > Math.PI / 4){buttonArea.goalRotationY = angle;}},500,{leading:true});})();}if(this.interactivityCheck === undefined){this.interactivityCheck = function(){return _this2.cameraInteractivityWorld.detectInteractions(_this2.camera);};}var imageDetails={width:width,height:height,url:image,events:null,object:null};this.buttons.push(imageDetails);this.layoutSpriteButtons();return new Promise(function(resolve){_this2.textureLoader.load(image,function(map){var material=new THREE.MeshBasicMaterial({map:map,color:0xffffff,fog:false,transparent:true});var sprite=new THREE.Mesh(new THREE.PlaneGeometry(width,height),material);imageDetails.sprite = sprite;sprite.position.z = -30;sprite.position.y = -5;sprite.scale.set(spriteScale,spriteScale,spriteScale);imageDetails.events = _this2.cameraInteractivityWorld.makeTarget(sprite);resolve(imageDetails.events);_this2.buttonArea.add(sprite);_this2.layoutSpriteButtons();callback(sprite);});});}},{key:'layoutSpriteButtons',value:function layoutSpriteButtons(){var offset=0;var length=this.buttons.reduce(function(a,b){return a + b.width;},0);var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=this.buttons[Symbol.iterator](),_step;!(_iteratorNormalCompletion = (_step = _iterator.next()).done);_iteratorNormalCompletion = true) {var iD=_step.value;if(iD.sprite){iD.sprite.position.x = (iD.width / 2 + offset - length / 2) * spriteScale;}offset += iD.width;}}catch(err) {_didIteratorError = true;_iteratorError = err;}finally {try{if(!_iteratorNormalCompletion && _iterator['return']){_iterator['return']();}}finally {if(_didIteratorError){throw _iteratorError;}}}}},{key:'addReticule',value:function addReticule(_ref2){var _this3=this;var image=_ref2.image;var _ref2$callback=_ref2.callback;var callback=_ref2$callback === undefined?noop:_ref2$callback;if(this.hud === undefined){var hud=new THREE.Object3D();hud.position.set(0,0,-15);hud.scale.set(0.5,0.5,0.5);this.camera.add(hud);this.scene.add(this.camera); // add the camera to the scene so that the hud is rendered
	this.hud = hud;}this.textureLoader.load(image,function(map){var material=new THREE.SpriteMaterial({map:map,color:0xffffff,fog:false,transparent:true,opacity:0.5});var sprite=new THREE.Sprite(material);_this3.hud.add(sprite);callback(sprite);});}},{key:'addPlayButton',value:function addPlayButton(){var _this4=this;if(this.playButton)return;this.playButton = this.addUiButton('Play','space','play-icon',function(e){_this4.removeButton(_this4.playButton);_this4.playButton = null;if(_this4.hasVideoTexture)_this4.updateTexture(_this4.videoTexture);_this4.video.play();e.stopPropagation();});}},{key:'addFullscreenButton',value:function addFullscreenButton(){var fullscreen=this.container.requestFullscreen || this.container.mozRequestFullscreen || this.container.webkitRequestFullscreen;this.addUiButton('Exit Fullscreen',null,'exit-fullscreen',function(){(document.exitFullscreen || document.mozExitFullscreen || document.webkitExitFullscreen).bind(document)();});if(document.isFullScreen !== undefined){this.addUiButton('Full Screen','F','fullscreen',function(){fullscreen.bind(this.container)();});this.addEventListener(document,'fullscreenchange',(function(){var _this5=this;if(document.isFullScreen){if(document.fullscreenElement === this.container){setTimeout(function(){return _this5.resize();},500);}}else {setTimeout(function(){return _this5.resize();},500);}}).bind(this));}else if(document.webkitIsFullScreen !== undefined){this.addUiButton('Full Screen','F','fullscreen',function(){fullscreen.bind(this.container)();});this.addEventListener(document,'webkitfullscreenchange',(function(){var _this6=this;if(document.webkitIsFullScreen){if(document.webkitFullscreenElement === this.container){setTimeout(function(){return _this6.resize();},500);}}else {setTimeout(function(){return _this6.resize();},500);}}).bind(this));}else if(document.mozIsFullScreen !== undefined){this.addUiButton('Full Screen','F','fullscreen',function(){fullscreen.bind(this.container)();});this.addEventListener(document,'mozfullscreenchange',(function(){var _this7=this;if(document.mozIsFullScreen){if(document.mozFullscreenElement === this.container){setTimeout(function(){return _this7.resize();},500);}}else {setTimeout(function(){return _this7.resize();},500);}}).bind(this));}}},{key:'addEventListener',value:function addEventListener(el,type,callback){this.listeners.push({el:el,type:type,callback:callback});el.addEventListener(type,callback);}},{key:'removeAllEventListeners',value:function removeAllEventListeners(){this.listeners.forEach(function remove(_ref3){var el=_ref3.el;var type=_ref3.type;var callback=_ref3.callback;el.removeEventListener(type,callback);});}},{key:'loadVideoTexture',value:function loadVideoTexture(){if(this.hasVideoTexture)return;var texture=new THREE.VideoTexture(this.video);texture.minFilter = THREE.LinearFilter;texture.magFilter = THREE.LinearFilter;texture.format = THREE.RGBFormat;this.hasVideoTexture = true;this.videoTexture = texture;}},{key:'updateTexture',value:function updateTexture(map){if(this.currentTexture === map)return;if(!map)throw Error('No texture to update');this.currentTexture = map;var material=new THREE.MeshBasicMaterial({color:0xffffff,map:map});this.sphere.material = material;}},{key:'addGeometry',value:function addGeometry(){var _this8=this;if(this.sphere){throw Error('Geometery already set up');}var poster=this.video?this.video.getAttribute('poster'):this.media.src;if(poster){this.textureLoader.load(poster,function(t){return (!_this8.hasVideoTexture || _this8.currentTexture !== _this8.videoTexture) && _this8.updateTexture(t);});}var material=new THREE.MeshBasicMaterial({color:0x888888,wireframe:true});var geometry=new THREE.SphereGeometry(5000,64,32);var mS=new THREE.Matrix4().identity();mS.elements[0] = -1;geometry.applyMatrix(mS);var sphere=new THREE.Mesh(geometry,material);rotateAroundWorldAxis(sphere,yAxis,-this.longOffset * DEG2RAD);this.sphere = sphere;this.scene.add(sphere);}},{key:'resize',value:function resize(){if(this.vrDisplay && this.vrDisplay.isPresenting){var leftEye=this.vrDisplay.getEyeParameters('left');var rightEye=this.vrDisplay.getEyeParameters('right');var _w=Math.max(leftEye.renderWidth,rightEye.renderWidth) * 2;var h=Math.max(leftEye.renderHeight,rightEye.renderHeight);this.camera.aspect = _w / h;this.renderer.setSize(_w,h);}else if(document.isFullScreen || document.webkitIsFullScreen || document.mozIsFullScreen){this.camera.aspect = window.innerWidth / window.innerHeight;this.renderer.setSize(window.innerWidth,window.innerHeight);}else {this.camera.aspect = this.media.width / this.media.height;this.renderer.setSize(this.media.width,this.media.height);}this.camera.updateProjectionMatrix();}},{key:'stopAnimation',value:function stopAnimation(){cancelAnimationFrame(this.raf);if(this.video){this.video.pause();}}},{key:'startAnimation',value:function startAnimation(){var _this9=this;this.raf = requestAnimationFrame(function(){return _this9.startAnimation();});this.render();}},{key:'load',value:function load(){var xhttp=new XMLHttpRequest();var text;xhttp.onreadystatechange = function(){if(this.readyState == 4 && this.status == 200){ //document.getElementById("demo").innerHTML =this.responseText;
	text = this.responseText; //console.log(this.responseText);
	console.log(text);}};xhttp.open("GET","http://10.211.161.222/pose.json",true);xhttp.send();return text;}},

	{key:'renderSceneView',value:function renderSceneView(pose,eye){var _orientation; //==============================================================
	
	
	var orientation=pose.orientation;var position=pose.position; //let velocity= pose.linearVelocity;

	if(new Date().getTime() - old_time > 1000) {

		var up = orientation[0] * old_orientation[0] + orientation[1] * old_orientation[1] + orientation[2] * old_orientation[2] + orientation[3] * old_orientation[3];
		var down = Math.pow((Math.pow(orientation[0],2) + Math.pow(orientation[1],2) + Math.pow(orientation[2],2) + Math.pow(orientation[3],2)),0.5) * Math.pow((Math.pow(old_orientation[0],2) + Math.pow(old_orientation[1],2) + Math.pow(old_orientation[2],2) + Math.pow(old_orientation[3],2)),0.5);
		velocity = Math.acos(up / down) / (new Date().getTime() - old_time) *1000 *180 / 3.14;

		old_orientation[0] = orientation[0];
		old_orientation[1] = orientation[1];
		old_orientation[2] = orientation[2];
		old_orientation[3] = orientation[3];
	
		old_time = new Date().getTime();

		// console.log('velocity: '+velocity);	

	}	

	if(velocity < 28.4) {  //slow,high FR 60
		a = 7;
	} else if(velocity >= 28.4 && velocity < 77.2) { //mideia, 40
		a = 6;
	} else { a = 4;}  //fast.low FR	20
	
	//==================================================================	
	if(!orientation){orientation = [0,0,0,1];}
	if(!position){position = [0,0,0];}this.camera.position.fromArray(position);
	(_orientation = this.orientation).set.apply(_orientation,_toConsumableArray(orientation));1;this.camera.rotation.setFromQuaternion(this.orientation,'XZY');
	if(eye){this.camera.projectionMatrix = fovToProjection(eye.fieldOfView,true,this.camera.near,this.camera.far);
	this.camera.position.add(new (_bind.apply(THREE.Vector3,[null].concat(_toConsumableArray(eye.offset))))());}
	else {this.camera.fov = this.fov || 90;this.camera.updateProjectionMatrix();} //
	this.renderer.render(this.scene,this.camera);}},



	{key:'render',value:function render(){

	
	counter += 1;
	if(counter > a){counter=1;
		// return;
		// console.log(counter);	
	}

	this.renderer.clear();if(this.hud)this.hud.visible = false;if(this.buttonArea)this.buttonArea.visible = false;if(this.vrDisplay){ // console.log('this is if statement');
	var pose=this.vrDisplay.getPose();if(this.vrDisplay.isPresenting){ //console.log('this is isPresenting if statement');
	if(this.hud)this.hud.visible = true;if(this.buttonArea){ //console.log('this is buttonArea if statement');
	this.buttonArea.checkInRange();this.buttonArea.rotation.y = (this.buttonArea.rotation.y + this.buttonArea.goalRotationY) / 2;this.buttonArea.visible = true;
	if(this.interactivityCheck)this.interactivityCheck();}var size=this.renderer.getSize();this.renderer.setScissorTest(true);
	this.renderer.setScissor(0,0,size.width / 2,size.height);this.renderer.setViewport(0,0,size.width / 2,size.height);
	this.renderSceneView(pose,this.vrDisplay.getEyeParameters('left')); //console.log('this is left eye part');
	this.renderer.setScissor(size.width / 2,0,size.width / 2,size.height);this.renderer.setViewport(size.width / 2,0,size.width / 2,size.height);
	this.renderSceneView(pose,this.vrDisplay.getEyeParameters('right'));this.renderer.setScissorTest(false);this.renderer.setViewport(0,0,size.width,size.height);
	this.vrDisplay.submitFrame(pose);}else { //console.log('this is isPresenting else statement');
	this.renderSceneView(pose,null);}}else { //console.log('going to else, no vrdisplay');
	// No VRDisplay found.
	this.renderer.render(this.scene,this.camera);}}},

	{key:'destroy',value:function destroy(){this.media.style.display = '';this.stopAnimation();this.removeAllEventListeners();
	       this.container.removeChild(this.buttonContainer);this.cameraInteractivityWorld.destroy();}},

	{key:'onVRRequestPresent',value:function onVRRequestPresent(){this.vrDisplay.requestPresent({source:this.renderer.domElement}).then(function(){},function(){console.error('requestPresent failed.',2000);});}},
	{key:'onVRExitPresent',value:function onVRExitPresent(){this.vrDisplay.exitPresent().then(function(){},function(){console.error('exitPresent failed.',2000);});}},
	{key:'onVRPresentChange',value:function onVRPresentChange(){this.resize();}},
	{key:'addUiButton',value:function addUiButton(text,shortcut,classname,callback){var button=document.createElement('button');if(classname)button.classList.add(classname);button.textContent = text;
	      this.addEventListener(button,'click',callback.bind(this));this.buttonContainer.appendChild(button);return button;}},
	{key:'removeButton',value:function removeButton(el){this.buttonContainer.removeChild(el);}}]);return ThreeSixtyMedia;})();module.exports = ThreeSixtyMedia;

/***/ },
/* 14 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var define = false;
	
	/* jshint devel: true */
	
	var _debug = undefined;
	
	function broadcast(eventType, data, target) {
		target = target || document.body;
	
		if (_debug) {
			console.log('o-viewport', eventType, data);
		}
	
		target.dispatchEvent(new CustomEvent('oViewport.' + eventType, {
			detail: data,
			bubbles: true
		}));
	}
	
	function getHeight(ignoreScrollbars) {
		return ignoreScrollbars ? document.documentElement.clientHeight : Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	}
	
	function getWidth(ignoreScrollbars) {
		return ignoreScrollbars ? document.documentElement.clientWidth : Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
	
	function getSize(ignoreScrollbars) {
		return {
			height: module.exports.getHeight(ignoreScrollbars),
			width: module.exports.getWidth(ignoreScrollbars)
		};
	}
	
	function getScrollPosition() {
		var de = document.documentElement;
		var db = document.body;
	
		// adapted from https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY
		var isCSS1Compat = (document.compatMode || '') === 'CSS1Compat';
	
		var ieX = isCSS1Compat ? de.scrollLeft : db.scrollLeft;
		var ieY = isCSS1Compat ? de.scrollTop : db.scrollTop;
		return {
			height: db.scrollHeight,
			width: db.scrollWidth,
			left: window.pageXOffset || window.scrollX || ieX,
			top: window.pageYOffset || window.scrollY || ieY
		};
	}
	
	function getOrientation() {
		var orientation = window.screen.orientation || window.screen.mozOrientation || window.screen.msOrientation || undefined;
		if (orientation) {
			return typeof orientation === 'string' ? orientation.split('-')[0] : orientation.type.split('-')[0];
		} else if (window.matchMedia) {
			return window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape';
		} else {
			return getHeight() >= getWidth() ? 'portrait' : 'landscape';
		}
	}
	
	function detectVisiblityAPI() {
		var hiddenName = undefined;
		var eventType = undefined;
		if (typeof document.hidden !== 'undefined') {
			hiddenName = 'hidden';
			eventType = 'visibilitychange';
		} else if (typeof document.mozHidden !== 'undefined') {
			hiddenName = 'mozHidden';
			eventType = 'mozvisibilitychange';
		} else if (typeof document.msHidden !== 'undefined') {
			hiddenName = 'msHidden';
			eventType = 'msvisibilitychange';
		} else if (typeof document.webkitHidden !== 'undefined') {
			hiddenName = 'webkitHidden';
			eventType = 'webkitvisibilitychange';
		}
	
		return {
			hiddenName: hiddenName,
			eventType: eventType
		};
	}
	
	function getVisibility() {
		var hiddenName = detectVisiblityAPI().hiddenName;
		return document[hiddenName];
	}
	
	function debounce(func, wait) {
		var timeout = undefined;
		return function () {
			var _this = this;
	
			var args = arguments;
			var later = function later() {
				timeout = null;
				func.apply(_this, args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	};
	
	function throttle(func, wait) {
		var timeout = undefined;
		return function () {
			var _this2 = this;
	
			if (timeout) {
				return;
			}
			var args = arguments;
			var later = function later() {
				timeout = null;
				func.apply(_this2, args);
			};
	
			timeout = setTimeout(later, wait);
		};
	};
	
	module.exports = {
		debug: function debug() {
			_debug = true;
		},
		broadcast: broadcast,
		getWidth: getWidth,
		getHeight: getHeight,
		getSize: getSize,
		getScrollPosition: getScrollPosition,
		getVisibility: getVisibility,
		getOrientation: getOrientation,
		detectVisiblityAPI: detectVisiblityAPI,
		throttle: throttle,
		debounce: debounce
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var define = false;
	
	/**
	 *
	 * Sets up an enviroment for detecting that
	 * the camera is looking at objects.
	 *
	 * Ported from https://github.com/AdaRoseEdwards/three-camera-interactions/blob/master/lib/index.js
	 */
	
	/*
	global THREE
	*/
	'use strict';
	
	var EventEmitter = __webpack_require__(16);
	
	var visibleFilter = function visibleFilter(object3d) {
		return object3d.visible;
	};
	var getObject = function getObject(target) {
		return target.object3d;
	};
	
	/**
	 * Keeps track of interactive 3D elements and
	 * can be used to trigger events on them.
	 *
	 * The domElement is to pick up touch ineractions
	 *
	 * @param  {[type]} domElement [description]
	 * @return {[type]}            [description]
	 */
	module.exports = function CameraInteractivityWorld(domElement, threeOverride) {
		var _this2 = this;
	
		var THREE_IN = threeOverride || THREE;
	
		if (!THREE_IN) throw Error('No Three Library Detected');
	
		var InteractivityTarget = (function (_EventEmitter) {
			_inherits(InteractivityTarget, _EventEmitter);
	
			function InteractivityTarget(node) {
				var _this = this;
	
				_classCallCheck(this, InteractivityTarget);
	
				_get(Object.getPrototypeOf(InteractivityTarget.prototype), 'constructor', this).call(this);
				this.position = node.position;
				this.hasHover = false;
				this.object3d = node;
	
				this.on('hover', function () {
					if (!_this.hasHover) {
						_this.emit('hoverStart');
					}
					_this.hasHover = true;
				});
	
				this.on('hoverEnd', function () {
					_this.hasHover = false;
				});
			}
	
			_createClass(InteractivityTarget, [{
				key: 'hide',
				value: function hide() {
					this.object3d.visible = false;
				}
			}, {
				key: 'show',
				value: function show() {
					this.object3d.visible = true;
				}
			}]);
	
			return InteractivityTarget;
		})(EventEmitter);
	
		this.targets = new Map();
	
		var raycaster = new THREE_IN.Raycaster();
		this.detectInteractions = function (camera) {
	
			var targets = Array.from(this.targets.values());
			raycaster.setFromCamera(new THREE_IN.Vector2(0, 0), camera);
			var hits = raycaster.intersectObjects(targets.map(getObject).filter(visibleFilter));
			var target = false;
	
			if (hits.length) {
	
				// Show hidden text object3d child
				target = this.targets.get(hits[0].object);
				if (target) target.emit('hover');
			}
	
			// if it is not the one just marked for highlight
			// and it used to be highlighted un highlight it.
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;
	
			try {
				for (var _iterator = targets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var t = _step.value;
	
					if (t !== target && t.hasHover) t.emit('hoverEnd');
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		};
	
		var interact = function interact(event) {
			Array.from(_this2.targets.values()).forEach(function (target) {
				if (target.hasHover) {
					target.emit(event.type);
				}
			});
		};
		this.interact = interact;
	
		domElement.addEventListener('click', interact);
		domElement.addEventListener('mousedown', interact);
		domElement.addEventListener('mouseup', interact);
		domElement.addEventListener('touchup', interact);
		domElement.addEventListener('touchdown', interact);
	
		this.destroy = function () {
			domElement.removeEventListener('click', interact);
			domElement.removeEventListener('mousedown', interact);
			domElement.removeEventListener('mouseup', interact);
			domElement.removeEventListener('touchup', interact);
			domElement.removeEventListener('touchdown', interact);
		};
	
		this.makeTarget = function (node) {
			var newTarget = new InteractivityTarget(node);
			_this2.targets.set(node, newTarget);
			return newTarget;
		};
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;
	
	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;
	
	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;
	
	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;
	
	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};
	
	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;
	
	  if (!this._events)
	    this._events = {};
	
	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }
	
	  handler = this._events[type];
	
	  if (isUndefined(handler))
	    return false;
	
	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }
	
	  return true;
	};
	
	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events)
	    this._events = {};
	
	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);
	
	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];
	
	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }
	
	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.on = EventEmitter.prototype.addListener;
	
	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  var fired = false;
	
	  function g() {
	    this.removeListener(type, g);
	
	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }
	
	  g.listener = listener;
	  this.on(type, g);
	
	  return this;
	};
	
	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events || !this._events[type])
	    return this;
	
	  list = this._events[type];
	  length = list.length;
	  position = -1;
	
	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	
	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }
	
	    if (position < 0)
	      return this;
	
	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }
	
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;
	
	  if (!this._events)
	    return this;
	
	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }
	
	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }
	
	  listeners = this._events[type];
	
	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];
	
	  return this;
	};
	
	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};
	
	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];
	
	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};
	
	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	
	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ }
/******/ ]);
//# sourceMappingURL=demo.js.map