// pages/index.
import HeroSection from './land_components/HeloSection';
import NavHeader from '../../../layout/NavHeader';
import AchievementSection from './land_components/AchievementSection';
import IdeasSection from './land_components/IdeasSection';
import ABoutUsTree from './land_components/AboutUs';
import Footer from '../../../layout/Footer';
import ContactComponent from './land_components/ContactUs';


export default function LandingPage() {
  return (
    <div className="px-0 bg-white">
      <NavHeader />
       <HeroSection />
       <IdeasSection />
       <AchievementSection />
       <ABoutUsTree />
       <ContactComponent/>
       <Footer/>
    </div>
  )
}
