import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import { Suspense, lazy } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import { LiveAuctionProvider } from "./contexts/LiveAuctionContext";
import { LoadingState } from "./components/LoadingState";

// Eager load critical pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Lazy load all other pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/dashboards/AdminDashboard"));
const ArtistDashboard = lazy(() => import("./pages/dashboards/EnhancedArtistDashboard"));
const CollectorDashboard = lazy(() => import("./pages/dashboards/EnhancedCollectorDashboard"));
const GalleryDashboard = lazy(() => import("./pages/dashboards/EnhancedGalleryDashboard"));
const CuratorDashboard = lazy(() => import("./pages/dashboards/EnhancedCuratorDashboard"));
const PartnerDashboard = lazy(() => import("./pages/dashboards/EnhancedPartnerDashboard"));
const ConsultantDashboard = lazy(() => import("./pages/dashboards/EnhancedConsultantDashboard"));
const GuestDashboard = lazy(() => import("./pages/dashboards/GuestDashboard"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const ArtworkDetails = lazy(() => import("./pages/ArtworkDetails"));
const Auctions = lazy(() => import("./pages/Auctions"));
const Streams = lazy(() => import("./pages/Streams"));
const StreamDetails = lazy(() => import("./pages/StreamDetails"));
const Clubs = lazy(() => import("./pages/Clubs"));
const ClubDetails = lazy(() => import("./pages/ClubDetails"));
const Profile = lazy(() => import("./pages/Profile"));
const Wallet = lazy(() => import("./pages/Wallet"));
const ArtworkSubmission = lazy(() => import("./pages/ArtworkSubmission"));
const MyArtworks = lazy(() => import("./pages/MyArtworks"));
const EditArtwork = lazy(() => import("./pages/EditArtwork"));
const ModerationDashboard = lazy(() => import("./pages/ModerationDashboard"));
const AdvancedSearch = lazy(() => import("./pages/AdvancedSearch"));
const HomePage = lazy(() => import("./pages/HomePage"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const MarketplacePage = lazy(() => import("./pages/MarketplacePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const HelpCenterPage = lazy(() => import("./pages/HelpCenterPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const Admin = lazy(() => import("./pages/Admin"));
const Streaming = lazy(() => import("./pages/Streaming"));
const Consultations = lazy(() => import("./pages/Consultations"));
const LandingBuilder = lazy(() => import("./pages/LandingBuilder"));
const WebsiteBuilder = lazy(() => import("./pages/WebsiteBuilder"));
const Analytics = lazy(() => import("./pages/Analytics"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard"));
const InformationPanel = lazy(() => import("./pages/InformationPanel"));
const ArtworkPassport = lazy(() => import("./pages/ArtworkPassport"));
const EventDetails = lazy(() => import("./pages/EventDetails"));
const AccessManagement = lazy(() => import("./pages/AccessManagement"));
const Messenger = lazy(() => import("./pages/Messenger"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const ArtworkDetail = lazy(() => import("./pages/ArtworkDetail"));
const ProfilePage = lazy(() => import("./pages/UniversalProfile"));
const Statistics = lazy(() => import("./pages/Statistics"));
const DealFeed = lazy(() => import("./pages/DealFeed"));
const AdvancedAnalytics = lazy(() => import("./pages/AdvancedAnalytics"));
const NotificationCenter = lazy(() => import("./pages/NotificationCenter"));
const EnhancedSearch = lazy(() => import("./pages/EnhancedSearch"));
const PortfolioManager = lazy(() => import("./pages/PortfolioManager"));
const MarketInsights = lazy(() => import("./pages/MarketInsights"));
const ArtistDiscovery = lazy(() => import("./pages/ArtistDiscovery"));
const ExhibitionCalendar = lazy(() => import("./pages/ExhibitionCalendar"));
const ArtistVerification = lazy(() => import("./pages/ArtistVerification"));
const ArtworkAuthentication = lazy(() => import("./pages/ArtworkAuthentication"));
const LiveAuctionRoom = lazy(() => import("./pages/LiveAuctionRoom"));
const RFQSystem = lazy(() => import("./pages/RFQSystem"));
const Crowdfunding = lazy(() => import("./pages/Crowdfunding"));
const ArtCredit = lazy(() => import("./pages/ArtCredit"));
const ArtInsurance = lazy(() => import("./pages/ArtInsurance"));
const GalleryCRM = lazy(() => import("./pages/GalleryCRM"));
const ArtistStorefront = lazy(() => import("./pages/ArtistStorefront"));
const PrivateSales = lazy(() => import("./pages/PrivateSales"));
const LogisticsStorage = lazy(() => import("./pages/LogisticsStorage"));
const InvestmentManagement = lazy(() => import("./pages/InvestmentManagement"));
const BlockchainPassport = lazy(() => import("./pages/BlockchainPassport"));
const EventPlatform = lazy(() => import("./pages/EventPlatform"));
const CertificationExpertise = lazy(() => import("./pages/CertificationExpertise"));
const AIPricingEngine = lazy(() => import("./pages/AIPricingEngine"));
const KnowledgeBase = lazy(() => import("./pages/KnowledgeBase"));
const ARTNews = lazy(() => import("./pages/ARTNews"));
const MobileApp = lazy(() => import("./pages/MobileApp"));
const TokenizationPlatform = lazy(() => import("./pages/TokenizationPlatform"));
const SubscriptionPlans = lazy(() => import("./pages/SubscriptionPlans"));
const ServicesMarketplace = lazy(() => import("./pages/ServicesMarketplace"));

function Router() {
  return (
    <Suspense fallback={<LoadingState fullScreen />}>
      <Switch>
        {/* Public routes */}
        <Route path={"/"} component={HomePage} />
        <Route path={"/login"} component={Login} />
        <Route path={"/register"} component={Register} />
        <Route path={"/home"} component={HomePage} />
        <Route path={"/profile/me"} component={UserProfilePage} />
        <Route path={"/settings"} component={SettingsPage} />
        <Route path={"/marketplace"} component={MarketplacePage} />
        
        {/* Role-specific dashboards */}
        <Route path={"/admin/dashboard"} component={AdminDashboard} />
        <Route path={"/artist/dashboard"} component={ArtistDashboard} />
        <Route path={"/collector/dashboard"} component={CollectorDashboard} />
        <Route path={"/gallery/dashboard"} component={GalleryDashboard} />
        <Route path={"/curator/dashboard"} component={CuratorDashboard} />
        <Route path={"/partner/dashboard"} component={PartnerDashboard} />
        <Route path={"/consultant/dashboard"} component={ConsultantDashboard} />
        <Route path={"/guest/dashboard"} component={GuestDashboard} />
        <Route path={"/user/dashboard"} component={GuestDashboard} />
        
        {/* General pages */}
        <Route path={"/dashboard"} component={Dashboard} />
        <Route path={"/marketplace"} component={Marketplace} />
        <Route path={"/artworks/:id"} component={ArtworkDetails} />
        <Route path={"/artwork/:id"} component={ArtworkDetail} />
        <Route path={"/auctions"} component={Auctions} />
        <Route path={"/live-auction"} component={LiveAuctionRoom} />
        <Route path={"/auction/live/:id"} component={LiveAuctionRoom} />
        <Route path={"/streams"} component={Streams} />
        <Route path={"/streams/:id"} component={StreamDetails} />
        <Route path={"/clubs"} component={Clubs} />
        <Route path={"/clubs/:id"} component={ClubDetails} />
        <Route path={"/profile"} component={Profile} />
        <Route path={"/wallet"} component={Wallet} />
        <Route path={"/rfq"} component={RFQSystem} />
        <Route path={"/crowdfunding"} component={Crowdfunding} />
        <Route path={"/art-credit"} component={ArtCredit} />
        <Route path={"/art-insurance"} component={ArtInsurance} />
        <Route path={"/gallery-crm"} component={GalleryCRM} />
        <Route path={"/artist-storefront"} component={ArtistStorefront} />
        <Route path={"/private-sales"} component={PrivateSales} />
        <Route path={"/logistics"} component={LogisticsStorage} />
        <Route path={"/investments"} component={InvestmentManagement} />
        <Route path={"/blockchain-passport"} component={BlockchainPassport} />
        <Route path={"/events"} component={EventPlatform} />
        <Route path={"/certification"} component={CertificationExpertise} />
        <Route path={"/ai-pricing"} component={AIPricingEngine} />
        <Route path={"/knowledge-base"} component={KnowledgeBase} />
        <Route path={"/news"} component={ARTNews} />
        <Route path={"/mobile-app"} component={MobileApp} />
        <Route path={"/tokenization"} component={TokenizationPlatform} />
        <Route path={"/subscription"} component={SubscriptionPlans} />
        <Route path={"/services"} component={ServicesMarketplace} />
        <Route path={"/artworks/submit"} component={ArtworkSubmission} />
        <Route path={"/artworks/my"} component={MyArtworks} />
        <Route path={"/artworks/edit/:id"} component={EditArtwork} />
        <Route path={"/admin/moderation"} component={ModerationDashboard} />
        <Route path={"/search/advanced"} component={AdvancedSearch} />
        <Route path={"/analytics/dashboard"} component={AnalyticsDashboard} />
        <Route path={"/gallery/dashboard"} component={GalleryDashboard} />
        <Route path={"/collector/dashboard"} component={CollectorDashboard} />
        <Route path={"/admin"} component={Admin} />
        <Route path={"/streaming"} component={Streaming} />
        <Route path={"/consultations"} component={Consultations} />
        <Route path={"/landing-builder"} component={LandingBuilder} />
        <Route path={"/website-builder"} component={WebsiteBuilder} />
        <Route path={"/analytics"} component={Analytics} />
        <Route path={"/information-panel"} component={InformationPanel} />
        <Route path={"/artwork-passport/:id"} component={ArtworkPassport} />
        <Route path={"/events/:id"} component={EventDetails} />
        <Route path={"/access-management"} component={AccessManagement} />
        <Route path={"/messenger"} component={Messenger} />
        <Route path={"/user/:username"} component={UserProfile} />
        <Route path={"/genre/:genre"} component={Marketplace} />
        <Route path={"/statistics"} component={Statistics} />
        <Route path={"/:role/statistics"} component={Statistics} />
        <Route path={"/deal-feed"} component={DealFeed} />
        <Route path={"/advanced-analytics"} component={AdvancedAnalytics} />
        <Route path={"/notifications"} component={NotificationCenter} />
        <Route path={"/search"} component={EnhancedSearch} />
        <Route path={"/portfolio"} component={PortfolioManager} />
        <Route path={"/market-insights"} component={MarketInsights} />
        <Route path={"/artist-discovery"} component={ArtistDiscovery} />
        <Route path={"/exhibitions"} component={ExhibitionCalendar} />
        <Route path={"/exhibition-calendar"} component={ExhibitionCalendar} />
        <Route path={"/artist-verification"} component={ArtistVerification} />
        <Route path={"/artwork-authentication"} component={ArtworkAuthentication} />
        <Route path={"/about"} component={AboutPage} />
        <Route path={"/faq"} component={FAQPage} />
        <Route path={"/help"} component={HelpCenterPage} />
        <Route path={"/contact"} component={ContactPage} />
        <Route path={"/404"} component={NotFoundPage} />
        
        {/* Final fallback route */}
        <Route component={NotFoundPage} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <WebSocketProvider>
            <LiveAuctionProvider>
              <TooltipProvider>
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: '#1e293b',
                      color: '#fff',
                      border: '1px solid #334155',
                    },
                  }}
                />
                <Router />
              </TooltipProvider>
            </LiveAuctionProvider>
          </WebSocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
