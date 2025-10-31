import "./App.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Virtual, Navigation, EffectFlip } from "swiper/modules";
import { data } from "./data";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface Event {
  year: number;
  info: string;
}

function App() {
  const [periodId, setPeriodId] = useState<number>(0);
  let period = data[periodId];
  const startDate = useRef(null);
  const endDate = useRef(null);
  const periodTitle = useRef(null);
  let circle = useRef<HTMLDivElement>(null);
  let circlePoints = document.querySelectorAll(".circle_point");

  useEffect(() => {
    let angleIncrement = (Math.PI * 2) / data.length;
    let points = [];
    let point;
    let angle;
    let i: number;
    let radius = circle?.current ? circle?.current?.offsetWidth / 2 : 0;
    for (i = 0; i < data.length; i++) {
      point = document.createElement("span");
      point.title = data[i]?.title || "";
      point.textContent = (i + 1).toString();
      point.className = "circle_point";
      point.id = (i + 1).toString();
      points.push(point);
      circle?.current?.appendChild(point);
      angle = angleIncrement * i - Math.PI / 4;
      gsap.set(point, {
        xPercent: -50,
        yPercent: -50,
        transformOrigin: "50% 50%",
        x: radius + Math.cos(angle) * radius,
        y: radius + Math.sin(angle) * radius,
      });
      if (i === 0) point.classList.add("hovered");
    }

    points.forEach((circlePoint, index) => {
      circlePoint.addEventListener("click", function () {
        document
          .querySelector(".circle_point.hovered")
          ?.classList.remove("hovered");
        circlePoint.classList.add("hovered");
        setPeriodId(+circlePoint.id - 1);
      });
    });
  }, []);

  useEffect(() => {
    circlePoints.forEach((circlePoint, index) => {
      +circlePoint.id === periodId + 1
        ? circlePoint.classList.add("hovered")
        : circlePoint?.classList.remove("hovered");
    });
    gsap.to(startDate.current, {
      innerText: data[periodId]?.year_start ? data[periodId]?.year_start : "",
      duration: 1,
      snap: {
        innerText: 1,
      },
    });
    gsap.to(endDate.current, {
      innerText: data[periodId]?.year_end ? data[periodId]?.year_end : "",
      duration: 1,
      snap: {
        innerText: 1,
      },
    });
    gsap.to(periodTitle.current, {
      innerText: data[periodId]?.title ? data[periodId]?.title : "",
      opacity: "100%",
      duration: 3,
    });
    gsap.to(".child_swiper", {
      duration: 1,
      opacity: "100%",
    });

    let circlePoint = document.getElementById(`${(periodId + 1).toString()}`);
    let clickX = gsap.getProperty(circlePoint, "x");
    let clickY = gsap.getProperty(circlePoint, "y");
    let radius = circle?.current ? circle?.current?.offsetWidth / 2 : 0;
    let angle =
      360 -
      (Math.atan2((+clickY - radius) / radius, (+clickX - radius) / radius) *
        180) /
        Math.PI;
    gsap.to(circle.current, {
      rotation: angle - 45,
      duration: 3,
    });
    circlePoints.forEach((circlePoint, index) => {
      gsap.to(circlePoint, {
        rotation: -(angle - 45),
        duration: 0,
      });
    });
  }, [periodId]);

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <div className="page_title">Исторические даты</div>
          <div className="years">
            {data[0]?.year_start && (
              <div className="blue" ref={startDate}>
                {data[0]?.year_start}
              </div>
            )}
            {data[0]?.year_end && (
              <div className="pink" ref={endDate}>
                {data[0]?.year_end}
              </div>
            )}
          </div>
          <div className="viewport-box">
            <div ref={circle} className="main-circle"></div>
            {data[0]?.title && (
              <span className="period_title" ref={periodTitle}>
                {data[0]?.title}
              </span>
            )}
            <div className="cross"></div>
          </div>
        </div>
        <div className="main_swiper">
          <div className="flex">
            <div>
              <div className="main_pagination">
                0{periodId + 1}/0{data.length}
              </div>
              <div className="main_navigation">
                {periodId > 0 ? (
                  <div
                    className="main-button-prev"
                    onClick={() => setPeriodId((prev: number) => prev - 1)}
                  ></div>
                ) : (
                  <div className="main-button-prev disable"></div>
                )}
                {periodId < data.length - 1 ? (
                  <div
                    className="main-button-next"
                    onClick={() => setPeriodId((prev: number) => prev + 1)}
                  ></div>
                ) : (
                  <div className="main-button-next disable"></div>
                )}
              </div>
            </div>
            <div className="flex">
              {data.map((item, id) => {
                return (
                  <span
                    key={item?.id}
                    onClick={() => setPeriodId(id)}
                    className={
                      id === periodId ? "slide_point active" : "slide_point"
                    }
                  ></span>
                );
              })}
            </div>
          </div>
          <Swiper
            modules={[Virtual, Navigation, EffectFlip]}
            slidesPerView="auto"
            spaceBetween={20}
            navigation={{
              nextEl: ".button-next",
              prevEl: ".button-prev",
            }}
            grabCursor={true}
            virtual
            className="child_swiper"
          >
            {period.children.map((event: Event) => (
              <SwiperSlide>
                <div className="event">
                  <div className="event_year">{event.year}</div>
                  <div className="event_info">{event.info}</div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="button-prev"></div>
        <div className="button-next"></div>
      </div>
    </div>
  );
}

export default App;
