import { useMemo } from "react";
import Loader from '@custom/shared/components/Loader';
import Slider from "react-slick";
import styles from './style.module.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ShowWaitingMessage } from "./WaitingMessage";

export const WaittingSlider = ({ denied }) => {
  var settings = {
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 10000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    useMemo(() => (
      <div className="slider-container">
        <Slider {...settings} className={styles.phSlider}>
          <div className="slide">
            <h1>The problem isn't you, it's just life.</h1>
            Introducing relational fitness, an entirely new concept with one goal: to help you feel better. Peoplehood is a guided group conversation practice where each of us gets a chance to talk freely and listen deeply. A place to grow personally, together.
          </div>
          <div className="slide">
            <h1>Peoplehood</h1>
            A place to grow personally, together. Our Gathers are 60-minute community conversation experiences, led by trained Guides who are connection superstars. Peoplehood Gathers take place in our digital sanctuary and are filled with uplifting music, mind clearing breathwork and many “aha moments.” Gatherers have the rare opportunity to share honestly and listen as much as they talk. Together, we create high quality human connections.
          </div>
          <div className="slide">
            <h1>For the best possible experience, we kindly ask that you:</h1>
            <ul>
              <li>Use a laptop or desktop computer (not a mobile device)</li>
              <li>Join the Gather from a location with a strong internet connection</li>
              <li>Find a quiet, private place where you can be uninterrupted (ideally, not where you work)</li>
              <li>Log on to the Zoom link a few minutes before the start time</li>
              <li>Turn your camera on (this is a must--we’re in this together)</li>
              <li>Turn your phone ringer and notifications off</li>
              <li>For any questions during the experience, please type them in the Zoom chat</li>
            </ul>
          </div>
        </Slider>
        <ShowWaitingMessage denied={denied} />
        <style jsx>{`
          .slider-container {
            display: flex;
            width: 100%;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          
          .slide {
            display: flex !important;
            justify-content: center;
            flex-direction: column;
            padding: 10%;
            text-align: left;
            font-size: large;
          }
        `}</style>
      </div>
    ), [denied])
  )
}