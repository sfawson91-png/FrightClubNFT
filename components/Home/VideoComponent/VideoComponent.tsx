'use client';

import React from 'react';
import Container from '@mui/material/Container';
import styles from './VideoComponent.module.css';
import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import { useState } from 'react'

interface VideoFrameProps {
    videoSrc: string;
    buttonLabel: string;
    href: string;
    disabled?: boolean; // Make the disabled property optional
}

interface VideoComponentProps {
    signatureCompleted: boolean;
    onClose?: () => void;
}

const VideoFrame: React.FC<VideoFrameProps & { onClose?: () => void }> = ({ videoSrc, buttonLabel, href, disabled, onClose }) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const router = useRouter();
    const [isPlaying, setIsPlaying] = useState(false);

    React.useEffect(() => {
        const currentVideoRef = videoRef.current; // Create a local reference
    
        const handleMouseEnter = () => {
            if (currentVideoRef && !disabled) {
                currentVideoRef.play();
                setIsPlaying(true);
            }
        };
    
        const handleMouseLeave = () => {
            if (currentVideoRef && !disabled) {
                currentVideoRef.pause();
                setIsPlaying(false);
            }
        };
    
        if (currentVideoRef) {
            // Set loop and playsInline attributes
            currentVideoRef.loop = true;
            currentVideoRef.playsInline = true;
    
            // Add event listeners for mouse enter and leave
            currentVideoRef.addEventListener('mouseenter', handleMouseEnter);
            currentVideoRef.addEventListener('mouseleave', handleMouseLeave);
    
            // Cleanup event listeners when the component unmounts
            return () => {
                currentVideoRef.removeEventListener('mouseenter', handleMouseEnter);
                currentVideoRef.removeEventListener('mouseleave', handleMouseLeave);
            };
        }
    }, [disabled]);
    
    const handleMouseEnter = () => {
        if (videoRef.current && !disabled) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current && !disabled) {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleClick = () => {
        if (!disabled) {
            router.push(href);
            if (onClose) {
                onClose();
            }
        }
    };

    return (
        <div className={styles.frame}>
            <video 
                ref={videoRef} 
               
                muted 
                loop 
                playsInline
                className={styles.video}
            >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <Button
                className={styles.button}
                onClick={handleClick}
                disabled={disabled || false} // Provide a default value of false if disabled is not provided
            >
                {buttonLabel}
            </Button>
        </div>
    );
}

const VideoComponent: React.FC<VideoComponentProps> = ({ signatureCompleted, onClose }) => {
    const videoData = [
        { videoSrc: '/VIDEO_1.mp4', buttonLabel: 'Home', href: '/' },
        { videoSrc: '/VIDEO_2.mp4', buttonLabel: 'Mint', href: '/MintingPage' },
        { videoSrc: '/VIDEO_3.mp4', buttonLabel: 'User Portal', disable: false, href: '/UserPortal' },
        { videoSrc: '/VIDEO_5.mp4', buttonLabel: 'FAQ', href: '/FAQ' }
    ];

    return (
        <Container maxWidth="md" sx={{ backgroundColor: 'black' }} className={styles.container}>
            <div className={styles.hallway}>
                {videoData.map((video, index) => (
                    <div className={styles.videoWrapper} key={index}>
                        <VideoFrame
                            videoSrc={video.videoSrc}
                            buttonLabel={video.buttonLabel}
                            href={video.href}
                            disabled={video.disable || false} // Provide a default value of false if disable is not provided
                            onClose={onClose}
                        />
                    </div>
                ))}
            </div>
        </Container>
    );
}

export default VideoComponent;
