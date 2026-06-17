package com.synapse.mobilidadeUniversitaria.websocket;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class TripTrackingController {

    @MessageMapping("/trips/{tripId}/location")
    @SendTo("/topic/trips/{tripId}/location")
    public TripLocationDTO updateLocation(@DestinationVariable Long tripId, TripLocationDTO location) {
        return location;
    }
}
