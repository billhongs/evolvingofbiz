/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/* Need to include the google map js in order to use this js
 * Dependency: https://maps.google.com/maps/api/js?sensor=false 
 */
jQuery(function() {
    var icon = new google.maps.MarkerImage("/uif/img/marker.png");
    jQuery('[data-lat][data-lng]').each(function() {
        map = new google.maps.Map(this, {
            center: new google.maps.LatLng(jQuery(this).data('lat'), jQuery(this).data('lng')),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            mapTypeControl: true,
            panControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL
            },
            zoomControl: true
        });
        marker = new google.maps.Marker({draggable: true, icon: icon, map: map, position: map.getCenter()});
        google.maps.event.addListener(marker, 'dragend',function() {
            var latitude = this.getPosition().lat();
            var longitude = this.getPosition().lng();
            jQuery(function() {
                jQuery("#latitude").val(latitude);
                jQuery("#longitude").val(longitude);
            });
        });
    });
});