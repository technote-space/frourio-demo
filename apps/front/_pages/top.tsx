import type { FC } from 'react';
import { memo } from 'react';
import Slider from 'react-slick';
import { Box, Image } from '@chakra-ui/react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Reservation from '^/components/Reservation';

const Top: FC = memo(() => {
  return <Box>
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
          <div><Image width="100%" height={400} p={1} objectFit="cover" src={`${process.env.BASE_PATH}/cover1.jpg`}/></div>
          <div><Image width="100%" height={400} p={1} objectFit="cover" src={`${process.env.BASE_PATH}/cover2.jpg`}/></div>
          <div><Image width="100%" height={400} p={1} objectFit="cover" src={`${process.env.BASE_PATH}/cover3.jpg`}/></div>
          <div><Image width="100%" height={400} p={1} objectFit="cover" src={`${process.env.BASE_PATH}/cover4.jpg`}/></div>
          <div><Image width="100%" height={400} p={1} objectFit="cover" src={`${process.env.BASE_PATH}/cover5.jpg`}/></div>
          <div><Image width="100%" height={400} p={1} objectFit="cover" src={`${process.env.BASE_PATH}/cover6.jpg`}/></div>
        </Slider>
      </Box>
    </Box>
    <Reservation/>
  </Box>;
});

Top.displayName = 'Top';
export default Top;
