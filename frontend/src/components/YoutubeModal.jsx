/* eslint-disable react/prop-types */
import YouTube from 'react-youtube';
import Modal from 'react-modal';

const YoutubeModal = ({ isOpen, onClose, videoId }) => {
  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <Modal 
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="YouTube Video"
      ariaHideApp={false}
    >
      <YouTube className='modal' videoId={videoId} opts={opts} />
    </Modal>
  );
};

export default YoutubeModal;