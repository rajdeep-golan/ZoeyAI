"use client";

import { CloseIcon } from "@/components/CloseIcon";
import { NoAgentNotification } from "@/components/NoAgentNotification";
import TranscriptionView from "@/components/TranscriptionView";
import {
  BarVisualizer,
  DisconnectButton,
  RoomAudioRenderer,
  RoomContext,
  VideoTrack,
  VoiceAssistantControlBar,
  useVoiceAssistant,
} from "@livekit/components-react";
import { AnimatePresence, motion } from "framer-motion";
import { Room, RoomEvent } from "livekit-client";
import { useCallback, useEffect, useState } from "react";
import type { ConnectionDetails } from "../api/connection-details/route";

export default function Page() {
  const [room] = useState(new Room());
  const [isCalling, setIsCalling] = useState(true); // State to track "Calling..."

  const onConnectButtonClicked = useCallback(async () => {
    try {
      setIsCalling(true); // Set "Calling..." state to true
      const url = new URL(
        process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? "/api/connection-details",
        window.location.origin
      );
      const response = await fetch(url.toString());
      const connectionDetailsData: ConnectionDetails = await response.json();

      await room.connect(connectionDetailsData.serverUrl, connectionDetailsData.participantToken);
      await room.localParticipant.setMicrophoneEnabled(true);

      setIsCalling(false); // Stop showing "Calling..." once connected
    } catch (error) {
      setIsCalling(false); // Stop "Calling..." on error
      onDeviceFailure(error);
    }
  }, [room]);

  useEffect(() => {
    room.on(RoomEvent.MediaDevicesError, onDeviceFailure);

    return () => {
      room.off(RoomEvent.MediaDevicesError, onDeviceFailure);
    };
  }, [room]);

  return (
    <main data-lk-theme="default" className="h-full grid content-center bg-[var(--lk-bg)]">
      <RoomContext.Provider value={room}>
        <div className="lk-room-container max-w-[1024px] w-[90vw] mx-auto max-h-[90vh]">
          <SimpleVoiceAssistant
            onConnectButtonClicked={onConnectButtonClicked}
            isCalling={isCalling}
          />
        </div>
      </RoomContext.Provider>
    </main>
  );
}

function SimpleVoiceAssistant(props: { onConnectButtonClicked: () => void; isCalling: boolean }) {
  const { state: agentState } = useVoiceAssistant();

  useEffect(() => {
    if (agentState === "disconnected") {
      props.onConnectButtonClicked(); // Automatically start the call when disconnected
    }
  }, [agentState, props]);

  return (
    <>
      <AnimatePresence mode="wait">
        {props.isCalling ? (
          <motion.div
            key="calling"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="grid items-center justify-center h-full"
          >
            <h1 className="text-white text-xl">Calling...</h1>
          </motion.div>
        ) : agentState !== "disconnected" ? (
          <motion.div
            key="connected"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="flex flex-col items-center gap-4 h-full"
          >
            <AgentVisualizer />
            <div className="flex-1 w-full">
              <TranscriptionView />
            </div>
            <div className="w-full">
              <ControlBar onConnectButtonClicked={props.onConnectButtonClicked} />
            </div>
            <RoomAudioRenderer />
            <NoAgentNotification state={agentState} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function AgentVisualizer() {
  const { state: agentState, videoTrack, audioTrack } = useVoiceAssistant();

  if (videoTrack) {
    return (
      <div className="h-[512px] w-[512px] rounded-lg overflow-hidden">
        <VideoTrack trackRef={videoTrack} />
      </div>
    );
  }
  return (
    <div className="h-[300px] w-full">
      <BarVisualizer
        state={agentState}
        barCount={5}
        trackRef={audioTrack}
        className="agent-visualizer"
        options={{ minHeight: 24 }}
      />
    </div>
  );
}

function ControlBar(props: { onConnectButtonClicked: () => void }) {
  const { state: agentState } = useVoiceAssistant();

  return (
    <div className="relative h-[60px]">
      <AnimatePresence>
        {agentState !== "disconnected" && agentState !== "connecting" && (
          <motion.div
            initial={{ opacity: 0, top: "10px" }}
            animate={{ opacity: 1, top: 0 }}
            exit={{ opacity: 0, top: "-10px" }}
            transition={{ duration: 0.4, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="flex h-8 absolute left-1/2 -translate-x-1/2  justify-center"
          >
            <VoiceAssistantControlBar controls={{ leave: false }} />
            <DisconnectButton>
              <CloseIcon />
            </DisconnectButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function onDeviceFailure(error: Error) {
  console.error(error);
  alert(
    "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
  );
}