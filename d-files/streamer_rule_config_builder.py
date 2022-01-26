import json

channel_count = 40
udp_start_emx = 20001

cameras_list = []
streams_list = []
stream_source = [ "emx" , "eml" ]

# for each channel :
port_increment = 0
for channel_number in range(0,channel_count):

    for source_type in stream_source:
        if source_type == "emx":
            udp_start = udp_start_emx
            port_number = udp_start + port_increment
            stream_name = port_number
        else:
            udp_start = udp_start_emx + 100
            port_number = udp_start + port_increment
            stream_name = port_number - 100
        cameras = dict()
        cameras["id"] = "%03d-%s-%s" % (channel_number,port_number,"in")
        cameras["ip"] = "0.0.0.0"
        cameras["port"] = port_number # this is incrementing
        cameras["protocol"] = "udp"

        streams = dict()
        streams["id"] = "%03d%s" % (channel_number,"-out")
        streams["video"] = {}
        streams["video"]["cam"] = cameras['id'] # this reference camera ID
        streams["video"]["pid"] = 0
        streams["audio"] = {}
        streams["audio"]["cam"] = cameras['id'] # this reference camera ID
        streams["audio"]["pid"] = 0
        streams["app"] = source_type
        streams["stream"] = stream_name  # this is stream name and will be part of playback url

        cameras_list.append(cameras)
        streams_list.append(streams)
    port_increment += 1

print(json.dumps(cameras_list))
print(json.dumps(streams_list))