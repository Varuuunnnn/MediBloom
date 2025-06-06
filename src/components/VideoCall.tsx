import React, { useState, useEffect, useRef } from 'react';
import { connect, createLocalVideoTrack, Room } from 'twilio-video';
import { Video, VideoOff, Mic, MicOff, PhoneOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface VideoCallProps {
  appointmentId: string;
  onClose: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ appointmentId, onClose }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [token, setToken] = useState<string>('');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Call your Supabase Edge Function to get Twilio token
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/video-token`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            identity: user.id,
            room: appointmentId,
          }),
        });

        const { token } = await response.json();
        setToken(token);
        connectToRoom(token);
      } catch (error) {
        console.error('Error getting token:', error);
      }
    };

    getToken();

    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [appointmentId]);

  const connectToRoom = async (token: string) => {
    try {
      const videoRoom = await connect(token, {
        name: appointmentId,
        audio: true,
        video: { width: 640, height: 480 }
      });

      setRoom(videoRoom);

      // Handle local participant
      videoRoom.localParticipant.tracks.forEach(publication => {
        if (publication.track) {
          const trackElement = publication.track.attach();
          localVideoRef.current?.appendChild(trackElement);
        }
      });

      // Handle remote participants
      videoRoom.participants.forEach(participant => {
        participant.tracks.forEach(publication => {
          if (publication.track) {
            const trackElement = publication.track.attach();
            remoteVideoRef.current?.appendChild(trackElement);
          }
        });
      });

      // Handle participants connecting
      videoRoom.on('participantConnected', participant => {
        participant.tracks.forEach(publication => {
          if (publication.track) {
            const trackElement = publication.track.attach();
            remoteVideoRef.current?.appendChild(trackElement);
          }
        });
      });

      // Handle participants disconnecting
      videoRoom.on('participantDisconnected', participant => {
        participant.tracks.forEach(publication => {
          if (publication.track) {
            const trackElements = publication.track.detach();
            trackElements.forEach(element => element.remove());
          }
        });
      });
    } catch (error) {
      console.error('Error connecting to room:', error);
    }
  };

  const toggleAudio = () => {
    if (room) {
      room.localParticipant.audioTracks.forEach(publication => {
        if (publication.track) {
          if (isAudioEnabled) {
            publication.track.disable();
          } else {
            publication.track.enable();
          }
        }
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    if (room) {
      room.localParticipant.videoTracks.forEach(publication => {
        if (publication.track) {
          if (isVideoEnabled) {
            publication.track.disable();
          } else {
            publication.track.enable();
          }
        }
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const endCall = () => {
    if (room) {
      room.disconnect();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <div ref={localVideoRef} className="w-full h-64 bg-gray-900 rounded-lg overflow-hidden" />
            <p className="absolute bottom-2 left-2 text-white text-sm">You</p>
          </div>
          <div className="relative">
            <div ref={remoteVideoRef} className="w-full h-64 bg-gray-900 rounded-lg overflow-hidden" />
            <p className="absolute bottom-2 left-2 text-white text-sm">Healthcare Provider</p>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4 mt-6">
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full ${
              isAudioEnabled ? 'bg-gray-200 hover:bg-gray-300' : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {isAudioEnabled ? (
              <Mic className="h-6 w-6 text-gray-700" />
            ) : (
              <MicOff className="h-6 w-6 text-white" />
            )}
          </button>
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full ${
              isVideoEnabled ? 'bg-gray-200 hover:bg-gray-300' : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {isVideoEnabled ? (
              <Video className="h-6 w-6 text-gray-700" />
            ) : (
              <VideoOff className="h-6 w-6 text-white" />
            )}
          </button>
          <button
            onClick={endCall}
            className="p-4 rounded-full bg-red-500 hover:bg-red-600"
          >
            <PhoneOff className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;