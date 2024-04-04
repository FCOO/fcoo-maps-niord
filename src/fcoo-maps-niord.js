/****************************************************************************
    fcoo-maps-niord

    (c) 2021, FCOO

    https://github.com/FCOO/fcoo-maps-niord
    https://github.com/FCOO

    Create leaflet-bootstrap-niord as MapLayer

****************************************************************************/

(function ($, L, i18next, window/*, document, undefined*/) {
    "use strict";

    //Create namespaces
    var ns = window.fcoo = window.fcoo || {},
        nsMap = ns.map = ns.map || {},

        nsNiord = window.Niord = window.Niord || {},
        nsNiordOptions = nsNiord.options;

    //createMapLayer = {MAPLAYER_ID: CREATE_MAPLAYER_AND_MENU_FUNCTION} See fcoo-maps/src/map-layer_00.js for description
    nsMap.createMapLayer = nsMap.createMapLayer || {};

    //Update icon with pro-versions
    $.extend(nsNiordOptions.partIcon, {
        MAP        : 'fal fa-map-marker-alt', //'fa-map-marker',
        //REFERENCE  : 'fa-link',
        //CATEGORY   : 'fa-folder',
        //TIME       : 'fa-clock',
        DETAILS    : $.bsNotyIcon.info, //'fa-info',
        //PROHIBITION: 'fa-times',
        //SIGNALS    : 'fa-volume-up',
        //NOTE       : 'far fa-sticky-note',
        //ATTACHMENT : 'fa-paperclip',
        //AREA       : 'far fa-square',
        //CHART      : 'fa-map',
        //PUBLICATION: 'fa-book-open',
        //SOURCE     : 'fa-copyright'
    });

    //Add link to time-setting for time-part
    nsNiordOptions.partFooter.TIME = ns.globalSettingFooter(ns.events.TIMEZONECHANGED, false/*or true*/ );

    //Set format for different type of data
    //vfFormatId = id for the format to use for date, time and position (latLng) when using the jquery-value-format
    nsNiordOptions.vfFormatId = {
        time        : 'time',           //"16:00" in selected timezone
        date        : 'date',           //"24. Dec 2018" in selected timezone
        date_weekday: 'date_weekday',   //"Monday 24. Dec 2018" in selected timezone
        date_long   : 'date_long',      //"24. December 2018" in selected timezone
        latLng      : ''                //A la N12&deg;34'56" E12&deg;34'56"
    };

    //Set options for when modal and extended modal is available

    //openNewModal : If true a "new"-icon in small-modal will open a new modal. Typical used if small modals are use as popups and the screen is widther
    nsNiordOptions.openNewModal = true;

    //normalModalExtendable : If true the mormal modal can extend to a version with map and inlined attachments.
    nsNiordOptions.normalModalExtendable = true;

    //modalIsExtended     : If true (and normalModalExtendable = true) the modal 'start' as extended (modal-option.isExtended: true)
    nsNiordOptions.modalIsExtended     = ns.modernizrDevice.isDesktop || ns.modernizrDevice.isTablet;

    //smallTableWithAllMessages: If true the table with all messages is single column
    nsNiordOptions.smallTableWithAllMessages = ns.modernizrDevice.isPhone;

    //Option to set if domain "fa" (firing areas) and "fe" (actual firing exercises) are combined
    nsNiordOptions.fa_fe_combined = true;

    //When a messag is center-on-map the MapLayer is added to the map
    nsNiordOptions.onCenterOnMap = function(message, map/*, elem*/){
        nsMap.getMapLayer('navigation_niord_'+message.mainType).addTo(map);
    };

    //functions to be called when single massage are loaded
    nsNiordOptions.loadingOn  = ns.workingOn;
    nsNiordOptions.loadingOff = ns.workingOff;

    //getDefaultMap return the default map to be used
    nsNiordOptions.getDefaultMap = function(){ return nsMap.mainMap; };


    //Sets icon for different domains
    var faIcon   = L.bsMarkerAsIcon('niord-fa', 'niord-fa', {faClassName: 'fa-triangle',     extraClassName:'fa-rotate-345'}),
        feIcon   = L.bsMarkerAsIcon('niord-fe', 'niord-fe', {faClassName: 'fa-triangle',     extraClassName:'fa-rotate-15' }),

        faIcon2  = L.bsMarkerAsIcon('niord-fa', 'niord-fa', {faClassName: 'fa-diamond-half', extraClassName:'fa-rotate-295'}),
        feIcon2  = L.bsMarkerAsIcon('niord-fe', 'niord-fe', {faClassName: 'fa-diamond-half', extraClassName:'fa-rotate-115'}),

        fafeIcon = [faIcon2[0].concat(feIcon2[0])];

    nsNiordOptions.domainIcon.fa = faIcon;
    nsNiordOptions.domainIcon.fe = feIcon;
    nsNiordOptions.domainIcon['fa-fe'] = fafeIcon;


    //modalFooter = Footer in modal
    nsNiordOptions.modalFooter = [
            {icon: 'fa-copyright', text: 'name:dma', link: 'link:dma'},
            {text: ['(','abbr:dma',')'], textClass:['me-0','me-0']}
        ];

    //modalSmallFooter = Footer in popup
    nsNiordOptions.modalSmallFooter = nsNiordOptions.modalFooter;

    //domainOnlyHover = [domain-id] of boolean. If true => polygon only 'visible' on hover
    nsNiordOptions.domainOnlyHover = {fa: true};

//    //Icon for filter rest-button = gray filter with cross over
//    nsNiordOptions.resetFilterIcon = [['fal text-secondary fa-filter', 'fa-times']];

    //Icon for filter rest-button = filter with slach over
    nsNiordOptions.resetFilterIcon = 'fal fa-filter-slash';

    //Icon for show-on-map in list of messages
    nsNiordOptions.showonMapIcon = 'fa-map-location-dot';

    /**********************************************************
    options for leaflet-bootstrap-niord
    **********************************************************/
    var nsNiordOptionsLeaflet = nsNiordOptions.leaflet;

    //tileUrl = url for the tile-layer of the map inside the bsModal-window
    //nsNiordOptionsLeaflet.tileUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';



    //mapOptions = options for map-objects in modal-windows
    $.extend(nsNiordOptionsLeaflet.mapOptions, {
        bsZoomControl: !window.bsIsTouch,   //Add bsZoom-control for no-touch browser
        maxZoom      : 18
    });

    //mmmIcons = class-names for different icons used in select of details in modal
    $.extend(nsNiordOptionsLeaflet.mmmIcons, {
        tooltipIcon: 'fa-rectangle-wide'
    });

    /**********************************************************
    Set Niord to read data from local site instead of https://niord.dma.dk/rest/public
    **********************************************************/
    //Overwrite window.Niord.domainUrl to get local copy af messages and publications at app.fcoo.dk/dynamic/niord
    nsNiord.domainUrl = function(){
        return ns.path.dataFileName(true, 'niord', 'messages.json');
    };

    nsNiord.publicationsUrl = function(){
        return ns.path.dataFileName(true, 'niord', 'publications.json');
    };


    /**************************************************
    Set up onClickCoordinate to use common latLng-modal
    **************************************************/
    nsNiord.options.onClickCoordinate  = function(coord, text/*, messageId*/){
        //Include text only if the current format is different from 'standard' Niord-format (= degree + decimal minutes)
        L.latLng(coord[1], coord[0]).asModal( ns.globalSetting.get('latlng') != window.latLngFormat.LATLNGFORMAT_DMM ? {header: {text:text}} : null);
    };

    /**************************************************
    Set up default error for Niord-data - NOT USEDE WHEN DATA ARE READ FROM APP.FCOO/DYNAMIC/NIORD
    **************************************************/
    /*
    var firstError = true;
    window.Niord.defaultPromiseOptions = {useDefaultErrorHandler: false};
    window.Niord.defaultErrorHandler = function(){
        if (firstError)
            $.bsNoty({
                type     : 'error',
                layout   : 'topCenter',
                closeWith: ['button'],
                content  : [
                    $('<div class="fw-bold"/>').i18n({da:'Fejl', en:'Error'}),
                    {
                        da: 'Der opstod en fejl under hentning af data med Navigationsadvarsler, Efterretninger for Søfarende samt Skydeområder og Skydeadvarsler fra Søfartsstyrelsen.<br>'+
                            'Prøv at indlæse siden igen lidt senere eller se informationerne på',
                        en: 'An error occurred while retrieving data with Navigational Warnings, Notices to Mariners, as well as Firing Areas and Warnings from the Danish Maritime Authority.<br>'+
                            'Try to reload this page later or find the information at'
                    },
                    {
                        text: {da:'Søfartsstyrelsens hjemmeside', en:'the Danish Maritime Authority webpage'},
                        link: {da:'https://www.soefartsstyrelsen.dk', en: 'https://www.dma.dk'}
                    }
                ]
            });
        firstError = false;
        return false;
    };
    */


    //Use same buttons in legends and main menu
    function niordButtonList(mapLayer){
        return [{
            icon   : 'fa-th-list',
            text   : {da:'Vis alle', en:'Show all'},
            class  :'min-width-5em',
            onClick: function(/*id, selected, $button, map, owner*/){
                var domain = mapLayer.options.domain.replace(' ', '-'); //Minor bug: if domain = "fa fe" it must be "fa-fe" :-(
                nsNiord.messages.forceFilterDomain = domain;
                nsNiord.messages.asModal.apply(nsNiord.messages, arguments);
            }
        },{
            icon   : nsNiordOptions.partIcon.PUBLICATION,
            text   : 'niord:publ',
            class  :'min-width-5em',
            onClick: function(/*id, selected, $button, map, owner*/){
                nsNiord.publications.show();
            }
        }];
    }

    /**************************************************
    MapLayer_Niord = Extended MapLayer with Niord-data
    **************************************************/
    function MapLayer_Niord(options) {
        $.extend(options, {
            layerOptions: {
                domain       : options.domain,
                backgroundWMS: options.backgroundWMS,
                colorInfo    : options.colorInfo,
                minZoom      : 5,
            },
            paneId          : 'NAVIGATION_NIORD',
            createPane      : true,
            createMarkerPane: true,
            minZoom         : 5,
            buttonList      : niordButtonList(this)
        });
        nsMap.MapLayer.call(this, options);
    }
    MapLayer_Niord.prototype = Object.create(nsMap.MapLayer.prototype);
    MapLayer_Niord.prototype.createLayer = function(options){
        if (options.backgroundWMS)
            return L.layerGroup([
                new L.GeoJSON.Niord(options),
                nsMap.layer_static({
                    layers   : options.backgroundWMS,
                    minZoom  : options.minZoom,
                    maxZoom  : options.maxZoom,
                    colorInfo: options.colorInfo
                })
            ]);
        else
            return new L.GeoJSON.Niord(options);
    };


    /****************************************************
    Add create-function to create Niord MapLayers
    ****************************************************/
    nsMap.createMapLayer['NAVIGATION_NIORD'] = function(options, addMenu){
        var mapLayer, menuList = [];

        //Add three different Niord-map-layers
        //Navigational Warnings (nw) and Notices to Mariners (nm) are identical
        $.each(['nw', 'nm'], function(index, id){
            mapLayer =
                nsMap._addMapLayer('navigation_niord_'+id, MapLayer_Niord, {
                    domain: id,
                    icon  : L.bsMarkerAsIcon('niord-'+id, 'niord-'+id),
                    text  : 'niord:'+id+'_plural',
                });
            menuList.push( mapLayer.menuItemOptions() );
        });

        //Firing Areas and Warnings is a special case since it contains two Niord domains and a underling map-layer with inactice areas
        mapLayer =
            nsMap._addMapLayer('navigation_niord_fa', MapLayer_Niord, {
                domain          : 'fa fe',
                backgroundWMS   : 'firing-areas-dk_latest',
                icon            : fafeIcon,
                text            : 'niord:fa-fe_plural',
                buttonList      : niordButtonList(this),

/*TEST START
                colorInfo: {
                    show: true,
                    icon: 'far fa-home',
                    onlyLand : false,
                    onlyWater : true,
                    bgColor: 'yellow',
                    width: 199,
                    allowTransparentColor: true,
                    getColor: function(options){
                        var letters = '0123456789ABCDEF';
                        var color = '#';
                        for (var i = 0; i < 6; i++) {
                            color += letters[Math.floor(Math.random() * 16)];
                        }
                        return options.transparent ? color : '';
                    },
                    getText: function(options){
                        return options.transparent ? {icon: 'fa-home', text: Math.random()} : {icon:'fa-grin-beam', text:'BINGO'};
                    }
                },
//TEST END */
        });

        menuList.push( mapLayer.menuItemOptions() );

        menuList.push({
            type      : 'buttons',
            buttonList: [{
                icon   : 'fa-th-list',
                text   : {da:'Vis alle', en:'Show all'},
                class  :'min-width-5em',
                onClick: function(){
                    nsNiord.messages.asModal();
                }
            },{
                icon   : nsNiordOptions.partIcon.PUBLICATION,
                text   : {da: 'Publikationer', en: 'Publications' },
                //text   : 'niord:publ',
                class  :'min-width-5em',
                onClick: function(){
                    nsNiord.publications.show();
                }
            }]
        });

        addMenu(menuList);
    };


}(jQuery, L, this.i18next, this, document));
