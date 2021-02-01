import type { FC } from 'react';
import { useMemo } from 'react';
import Slider from 'react-slick';
import { Box, Image } from '@chakra-ui/react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Reservation from '^/components/Reservation';

const Top: FC = () => {
  return useMemo(() => <Box>
    <Box width="100vw" marginLeft="calc((100% - 100vw) / 2)" bg="black">
      <Box maxW="1000px" margin="auto">
        <Slider
          infinite
          fade
          autoplay
          arrows={false}
          speed={2000}
          autoplaySpeed={5000}
          slidesToShow={1}
          slidesToScroll={1}
        >
          <div><Image width="100%" height={400} p={1} objectFit="cover" src="/cover1.jpg"/></div>
          <div><Image width="100%" height={400} p={1} objectFit="cover" src="/cover2.jpg"/></div>
          <div><Image width="100%" height={400} p={1} objectFit="cover" src="/cover3.jpg"/></div>
          <div><Image width="100%" height={400} p={1} objectFit="cover" src="/cover4.jpg"/></div>
          <div><Image width="100%" height={400} p={1} objectFit="cover" src="/cover5.jpg"/></div>
          <div><Image width="100%" height={400} p={1} objectFit="cover" src="/cover6.jpg"/></div>
        </Slider>
      </Box>
    </Box>
    <Reservation/>
  </Box>, []);
};

export default Top;
