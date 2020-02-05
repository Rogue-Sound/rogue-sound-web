import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { clearToken } from '@context/auth';
import { setCurrent, setQueue, stop } from '@context/playing';
import { playSong, disableRepeat } from '@services/spotify';
import { getCurrent } from '@services/api';
// setQueue, clearQueue, disableRepeat
import CurrentSong from '@components/CurrentSong';

import './Play.scss';

const Play = () => {
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(null);
  const [joinTimeout, setJoinTimeout] = useState(null);

  const reduxCurrent = useSelector(state => state.playing.current);

  const dispatch = useDispatch();

  const getQueue = async () => {
    try {
      const { songs } = await getCurrent();
      songs && Array.isArray(songs) && dispatch(setQueue(songs));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getQueue();
  }, [getQueue]);

  const handleJoin = async () => {
    try {
      // TODO: Disabled for now
      const { current, songs } = await getCurrent();
      // const current = mockedCurrent;
      const song = {
        uris: [current.songId],
        position_ms: current.position,
      };
      // TODO: Add queue handling
      try {
        await playSong(song);
        current && dispatch(setCurrent(current));
        songs && dispatch(setQueue(songs));
        const remainingTime = current.duration - current.position;
        setRemaining(remainingTime);
      } catch (err) {
        const {
          response: { status },
        } = err;
        // Token expired
        status === 401 && dispatch(clearToken());
        dispatch(stop());
      }
    } catch {
      dispatch(stop());
      setRemaining(null);
      setJoinTimeout(null);
    }
  };

  const joinRoom = async () => {
    setLoading(true);
    await handleJoin();
    disableRepeat();
    setLoading(false);
  };

  useEffect(() => {
    if (remaining) {
      joinTimeout && clearTimeout(joinTimeout);
      // Smart polling
      setJoinTimeout(setTimeout(() => handleJoin(), remaining));
    }
  }, [remaining]);

  // TODO: Add admin buttons?
  return (
    <>
      {!!remaining && (
        <div className="current-song-submitter">
          <FontAwesomeIcon icon="headphones" />
          {reduxCurrent.user} is now playing...
        </div>
      )}
      <div className="play-module">
        {/* TODO: Improve */}
        {remaining ? (
          <CurrentSong {...reduxCurrent} />
        ) : (
          <FontAwesomeIcon
            icon="play"
            className="play-module__join-icon"
            onClick={joinRoom}
          />
        )}
        {/* TODO: Add visual loading */}
        {loading && 'Loading'}
      </div>
    </>
  );
};

export default Play;
