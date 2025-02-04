import { DATA_ITEMS } from './constants/data-items';
import { ROADMAP_ITEMS } from './constants/roadmap-items';
import { FEATURE_ITEMS } from './constants/feature-items';
import { ADVANTAGE_ITEMS } from './constants/advantage-items';
import { TOKEN_OVERVIEW_ITEMS } from './constants/token-overview-items';

import { Carousel, CarouselContent, CarouselItem } from './components/common/carousel';

import Footer from './components/partials/footer';
import Navbar from './components/partials/navbar';
import Wrapper from './components/common/wrapper';
import DataItem from './components/items/data-item';
import Container from './components/common/container';
import AboutItem from './components/items/about-item';
import Typography from './components/common/typography';
import FeatureItem from './components/items/feature-item';
import AdvantageItem from './components/items/advantage-item';
import RoadmapItem, { RoadmapSubItem } from './components/items/roadmap-item';

const App: React.FC = () => {
  return (
    <main>
      <Wrapper className="flex flex-col items-center overflow-hidden">
        <img className="absolute top-0 -z-10 w-screen min-w-[800px]" src="/banner.png" />
        <Navbar />
        <Container className="flex h-[calc(100vh-300px)] w-full">
          <div className="flex w-full max-w-[400px] flex-col justify-center gap-4">
            <Typography.H1 className="text-center font-bold md:text-left">
              THE FUTURE OF YIELD FARMING WITH AI.
            </Typography.H1>
            <Typography.P className="text-center text-lg md:text-left">
              Discover the best farming pools with the intelligence of our platform. Simplify your
              DeFi journey and maximize your earnings.
            </Typography.P>
          </div>
        </Container>
      </Wrapper>
      <Wrapper className="py-14">
        <Container className="grid grid-cols-1 items-center justify-center gap-10 sm:gap-5 md:grid-cols-2">
          <div className="flex flex-col items-center gap-5">
            <Typography.H1 className="text-center font-bold text-[#FFB103] md:text-left">
              AI-POWERED DEFI REVOLUTION
            </Typography.H1>
            <Typography.P className="text-center text-lg md:text-left">
              We are a decentralized platform powered by AI to optimize yield farming in the DeFi
              ecosystem. We automate the process of identifying and managing high-performing farming
              pools, converting rewards into our native DFAI token, while prioritizing transparency
              and security through blockchain technology.
            </Typography.P>
          </div>
          <div className="flex flex-col items-center justify-center">
            <img alt="boot" src="/boot.png" />
          </div>
        </Container>
      </Wrapper>
      <Wrapper className="py-14">
        <Container>
          <Carousel
            className="w-full"
            opts={{
              align: 'start',
            }}
          >
            <CarouselContent>
              {FEATURE_ITEMS.map((feature, index) => (
                <CarouselItem key={index} className="pl-8 sm:basis-1/2 md:basis-1/2 lg:basis-1/4">
                  <FeatureItem {...feature} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </Container>
      </Wrapper>
      <Wrapper className="flex flex-col items-center py-14">
        <Container className="max-w-3xl space-y-5">
          <Typography.H1 className="text-center font-bold text-[#FFB103]">
            WHY CHOOSE US?
          </Typography.H1>
          <Typography.P className="text-center text-lg">
            DFAI offers a fully automated, secure, and transparent DeFi farming experience. With the
            power of AI, our platform simplifies the complex world of yield farming, allowing you to
            focus on maximizing your profits while we handle the technicalities.
          </Typography.P>
        </Container>
      </Wrapper>
      <Wrapper className="py-14">
        <Container className="relative flex items-center justify-center">
          <img alt="background" className="absolute -z-10 w-full" src="/background.png" />
          <div className="w-full space-y-4">
            <div className="w-full">
              <AboutItem
                className="sm:-ml-[3%] sm:-mt-[2%]"
                description="All operations are visible on the chart, providing you with complete insight into the performance of your assets and the platform's activities."
                title="CRYSTAL CLEAR TRANSPARENCY"
              />
            </div>
            <div className="flex w-full justify-end">
              <AboutItem
                className="sm:-mt-[10%] sm:mr-[2%]"
                description="All operations are visible on the chart, providing you with complete insight into the performance of your assets and the platform's activities."
                title="CRYSTAL CLEAR TRANSPARENCY"
              />
            </div>
            <div className="w-full">
              <AboutItem
                className="sm:-mb-[2%] sm:ml-[10%]"
                description="All operations are visible on the chart, providing you with complete insight into the performance of your assets and the platform's activities."
                title="CRYSTAL CLEAR TRANSPARENCY"
              />
            </div>
          </div>
        </Container>
      </Wrapper>
      <div className="flex w-full flex-col bg-[#161521]">
        <Wrapper className="flex flex-col items-center py-14">
          <Container className="max-w-3xl space-y-5">
            <Typography.H1 className="text-center font-bold">
              EXCLUSIVE ADVANTAGES FOR DFAI HOLDERS
            </Typography.H1>
            <Typography.P className="text-center text-lg">
              DFAI leverages automated strategies to optimize DeFi yields, focusing on sustainable
              token appreciation and operational transparency.
            </Typography.P>
          </Container>
        </Wrapper>
        <Wrapper className="py-14">
          <Container className="relative">
            <img
              alt="boot"
              className="absolute -right-[200px] -top-[40%] w-[350px] -rotate-12 md:-top-[60%] md:w-[400px]"
              src="/boot-gif.gif"
            />
            <Carousel
              className="w-full"
              opts={{
                align: 'start',
              }}
            >
              <CarouselContent>
                {ADVANTAGE_ITEMS.map((advantage, index) => (
                  <CarouselItem key={index} className="pl-8 sm:basis-1/2 md:basis-1/2 lg:basis-1/4">
                    <AdvantageItem {...advantage} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </Container>
        </Wrapper>
        <Wrapper className="flex flex-col items-center py-14">
          <Container className="max-w-3xl space-y-5">
            <Typography.H1 className="text-center font-bold">TOKENOMICS</Typography.H1>
            <Typography.P className="text-center text-lg">
              DFAI’s tokenomics are designed for sustainability and growth. The allocation balances
              presale, community rewards, and liquidity support, while reserving funds for the
              project’s continuous development.
            </Typography.P>
          </Container>
        </Wrapper>
        <Wrapper className="flex flex-col items-center py-14">
          <Container className="flex items-center justify-center rounded-3xl bg-black">
            <div className="grid min-h-[300px] w-full max-w-[800px] grid-cols-1 items-center justify-center gap-10 p-8 md:grid-cols-2">
              <div className="relative w-full md:h-[145%]">
                <img alt="coin" className="w-full md:absolute md:h-full md:w-fit" src="/coin.png" />
              </div>
              <div className="w-full">
                <Typography.H3>TOKEN OVERVIEW</Typography.H3>
                {TOKEN_OVERVIEW_ITEMS.map((item, index) => (
                  <Typography.P key={index} className="whitespace-normal break-words">
                    <span className="font-bold text-[#FFB103]">{item.title}</span>{' '}
                    {item.description}
                  </Typography.P>
                ))}
              </div>
            </div>
          </Container>
          <Container className="mt-10">
            {DATA_ITEMS.map((item, index) => (
              <DataItem key={index} {...item} />
            ))}
          </Container>
        </Wrapper>
      </div>
      <Wrapper className="flex flex-col items-center py-14">
        <Container className="max-w-3xl space-y-5">
          <Typography.H1 className="text-center font-bold">ROADMAP</Typography.H1>
          <Typography.P className="text-center text-lg">
            To learn more about each stage of the ROADMAP, read our White Paper
          </Typography.P>
        </Container>
        <Container>
          <div className="flex flex-col items-center justify-center">
            <div className="absolute mt-[160px] hidden h-[1px] w-[90%] items-center justify-between bg-[#FFB103] transition-all md:flex">
              <span className="h-[20px] w-[20px] rounded-full bg-[#FFB103]" />
              <span className="h-[20px] w-[20px] rounded-full bg-[#FFB103]" />
            </div>
            <div className="mt-10 grid w-full grid-cols-1 gap-10 md:grid-cols-3 md:gap-2">
              {ROADMAP_ITEMS.map((item, index) => (
                <RoadmapItem key={index} index={index + 1} {...item} />
              ))}
            </div>
          </div>
          <div className="mt-10 grid w-full grid-cols-1 gap-10 md:grid-cols-3 md:gap-2">
            {ROADMAP_ITEMS.map((item, index) => (
              <RoadmapSubItem key={index} {...item} />
            ))}
          </div>
        </Container>
      </Wrapper>
      <Footer />
    </main>
  );
};

export default App;
