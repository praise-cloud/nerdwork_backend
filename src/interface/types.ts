// Comic Book Reader App - Database Models (TypeScript Interfaces)
// Separated Authentication, User Accounts, and Financial Systems

// ================================
// AUTHENTICATION & IDENTITY
// ================================


type AuthUser = {
  id: string; // UUID
  email: string;
  username: string;
  password_hash: string;
  email_verified: boolean;
  two_factor_enabled: boolean;
  last_login_at?: Date;
  login_attempts: number;
  locked_until?: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface AuthSession {
  id: string;
  user_id: string; // Foreign key to AuthUser
  session_token: string;
  refresh_token: string;
  ip_address: string;
  user_agent: string;
  expires_at: Date;
  created_at: Date;
}

interface PasswordReset {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  used: boolean;
  created_at: Date;
}

// ================================
// USER PROFILES & ACCOUNTS
// ================================

interface UserProfile {
  id: string;
  auth_user_id: string; // Foreign key to AuthUser
  first_name?: string;
  last_name?: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  date_of_birth?: Date;
  country?: string;
  timezone?: string;
  language: string;
  preferences: UserPreferences;
  created_at: Date;
  updated_at: Date;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  reading_direction: 'ltr' | 'rtl';
  page_transition: 'slide' | 'fade' | 'none';
  auto_bookmark: boolean;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  new_comics: boolean;
  creator_updates: boolean;
  payment_alerts: boolean;
  marketing: boolean;
}

interface PrivacySettings {
  profile_visibility: 'public' | 'friends' | 'private';
  reading_history_visible: boolean;
  allow_friend_requests: boolean;
}

// ================================
// FINANCIAL ACCOUNTS & WALLETS
// ================================

interface UserWallet {
  id: string;
  user_profile_id: string; // Foreign key to UserProfile
  nwt_balance: string; // Decimal as string for precision
  nwt_locked_balance: string; // For pending transactions
  primary_wallet_address?: string; // Web3 wallet
  wallet_addresses: WalletAddress[];
  kyc_status: 'none' | 'pending' | 'verified' | 'rejected';
  kyc_level: number; // 0, 1, 2, 3 for different verification levels
  spending_limit_daily?: string;
  spending_limit_monthly?: string;
  created_at: Date;
  updated_at: Date;
}

interface WalletAddress {
  id: string;
  user_wallet_id: string;
  blockchain: 'ethereum' | 'polygon' | 'binance' | 'solana';
  address: string;
  is_verified: boolean;
  is_primary: boolean;
  label?: string;
  added_at: Date;
}

interface NWTTransaction {
  id: string;
  user_wallet_id: string;
  transaction_type: 'credit' | 'debit';
  category: 'purchase' | 'sale' | 'deposit' | 'withdrawal' | 'reward' | 'refund' | 'transfer' | 'fee';
  amount: string; // Decimal as string
  balance_before: string;
  balance_after: string;
  reference_id?: string; // Links to comic purchase, creator payout, etc.
  reference_type?: string;
  description: string;
  metadata?: Record<string, any>;
  blockchain_tx_hash?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'reversed';
  processed_at?: Date;
  created_at: Date;
}

interface PaymentMethod {
  id: string;
  user_wallet_id: string;
  type: 'card' | 'bank_account' | 'crypto_wallet' | 'paypal' | 'apple_pay' | 'google_pay';
  provider: string; // 'stripe', 'paypal', 'metamask', etc.
  provider_id: string; // External provider's ID
  is_verified: boolean;
  is_default: boolean;
  metadata: Record<string, any>; // Provider-specific data
  last_used_at?: Date;
  expires_at?: Date;
  created_at: Date;
  updated_at: Date;
}

interface Payment {
  id: string;
  user_wallet_id: string;
  payment_method_id?: string;
  amount: string;
  currency: string; // USD, EUR, ETH, BTC, etc.
  nwt_amount?: string; // If purchasing NWT
  exchange_rate?: string;
  payment_intent_id?: string; // Stripe/provider ID
  blockchain_tx_hash?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  failure_reason?: string;
  metadata: Record<string, any>;
  processed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// ================================
// CREATOR ACCOUNTS & EARNINGS
// ================================

interface CreatorProfile {
  id: string;
  user_profile_id: string; // Foreign key to UserProfile
  creator_name: string;
  bio?: string;
  website_url?: string;
  social_links: SocialLinks;
  verification_status: 'none' | 'pending' | 'verified' | 'rejected';
  verification_documents?: string[]; // URLs to verification docs
  tax_info?: TaxInformation;
  created_at: Date;
  updated_at: Date;
}

interface SocialLinks {
  twitter?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  discord?: string;
  website?: string;
}

interface TaxInformation {
  tax_id?: string;
  business_name?: string;
  business_type?: string;
  address: Address;
  w9_submitted: boolean;
}

interface Address {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface CreatorWallet {
  id: string;
  creator_profile_id: string;
  nwt_balance: string;
  nwt_pending_balance: string; // Earnings not yet paid out
  total_lifetime_earnings: string;
  commission_rate: string; // Default 0.7 (70%)
  minimum_payout_threshold: string;
  payout_schedule: 'weekly' | 'monthly' | 'on_demand';
  payout_method: PayoutMethod;
  created_at: Date;
  updated_at: Date;
}

interface PayoutMethod {
  type: 'bank_transfer' | 'paypal' | 'crypto_wallet';
  details: Record<string, any>; // Bank details, PayPal email, wallet address
  is_verified: boolean;
}

interface CreatorEarning {
  id: string;
  creator_wallet_id: string;
  source_id: string; // Comic ID, NFT ID, etc.
  source_type: 'comic_purchase' | 'nft_sale' | 'nft_royalty' | 'subscription' | 'tip' | 'bonus';
  gross_amount: string;
  platform_fee: string;
  creator_fee: string; // What creator gets after platform fee
  net_amount: string; // Final amount after all deductions
  commission_rate: string; // Rate used for this transaction
  payment_id?: string; // Reference to original payment
  buyer_user_id: string;
  payout_status: 'pending' | 'available' | 'paid' | 'held' | 'disputed';
  payout_batch_id?: string;
  earned_at: Date;
  paid_out_at?: Date;
  created_at: Date;
}

interface CreatorPayout {
  id: string;
  creator_wallet_id: string;
  batch_id: string; // For grouping multiple earnings
  total_amount: string;
  payout_method: PayoutMethod;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  transaction_id?: string; // Bank/PayPal/Crypto transaction ID
  failure_reason?: string;
  earnings_included: string[]; // Array of CreatorEarning IDs
  processed_at?: Date;
  created_at: Date;
}

// ================================
// COMIC CONTENT MANAGEMENT
// ================================

interface ComicSeries {
  id: string;
  creator_profile_id: string;
  title: string;
  description?: string;
  genres: string[];
  tags: string[];
  cover_image_url?: string;
  banner_image_url?: string;
  status: 'draft' | 'ongoing' | 'completed' | 'hiatus' | 'cancelled';
  age_rating: 'G' | 'PG' | 'PG-13' | 'R' | '18+';
  content_warnings: string[];
  is_published: boolean;
  publication_schedule?: string; // "Weekly", "Monthly", etc.
  next_issue_date?: Date;
  total_issues?: number;
  metadata: SeriesMetadata;
  created_at: Date;
  updated_at: Date;
}

interface SeriesMetadata {
  language: string;
  reading_direction: 'ltr' | 'rtl' | 'ttb';
  color_type: 'color' | 'grayscale' | 'black_white';
  art_style: string[];
  target_audience: string[];
}

interface Comic {
  id: string;
  series_id: string;
  issue_number: number;
  title: string;
  description?: string;
  cover_image_url?: string;
  page_count: number;
  file_size_mb?: number;
  pricing: ComicPricing;
  content_hash?: string; // For integrity verification
  is_published: boolean;
  publication_date?: Date;
  early_access_date?: Date; // For premium subscribers
  metadata: ComicMetadata;
  created_at: Date;
  updated_at: Date;
}

interface ComicPricing {
  is_free: boolean;
  price_nwt?: string;
  price_usd?: string; // Reference price
  early_access_price_nwt?: string;
  rental_price_nwt?: string;
  rental_duration_hours?: number;
}

interface ComicMetadata {
  estimated_reading_time: number; // minutes
  difficulty_level?: string;
  contains_text: boolean;
  language: string;
  file_format: 'cbz' | 'cbr' | 'pdf' | 'web';
}

interface ComicPage {
  id: string;
  comic_id: string;
  page_number: number;
  image_url: string;
  thumbnail_url?: string;
  image_hash: string;
  width: number;
  height: number;
  file_size_bytes: number;
  alt_text?: string; // For accessibility
  created_at: Date;
}

// ================================
// NFT & BLOCKCHAIN INTEGRATION
// ================================

interface ComicNFT {
  id: string;
  comic_id: string;
  creator_profile_id: string;
  token_standard: 'ERC-721' | 'ERC-1155' | 'SPL';
  contract_address: string;
  token_id: string;
  blockchain: 'ethereum' | 'polygon' | 'solana' | 'binance';
  metadata_uri: string; // IPFS or Arweave URL
  royalty_percentage: string; // Creator royalty on secondary sales
  max_supply?: number; // For ERC-1155
  current_supply: number;
  mint_config: NFTMintConfig;
  is_minted: boolean;
  mint_transaction_hash?: string;
  minted_at?: Date;
  created_at: Date;
  updated_at: Date;
}

interface NFTMintConfig {
  mint_price_eth?: string;
  mint_price_nwt?: string;
  whitelist_enabled: boolean;
  public_mint_enabled: boolean;
  max_per_wallet?: number;
  mint_start_date?: Date;
  mint_end_date?: Date;
}

interface NFTOwnership {
  id: string;
  comic_nft_id: string;
  owner_wallet_address: string;
  owner_user_id?: string; // If owner is a platform user
  quantity: number; // For ERC-1155
  acquired_at: Date;
  acquisition_type: 'mint' | 'purchase' | 'transfer' | 'airdrop';
  acquisition_transaction_hash: string;
  last_verified_at: Date;
}

interface NFTTransaction {
  id: string;
  comic_nft_id: string;
  transaction_type: 'mint' | 'transfer' | 'sale' | 'burn';
  from_address?: string;
  to_address: string;
  quantity: number;
  price_eth?: string;
  price_usd?: string;
  transaction_hash: string;
  block_number: number;
  gas_used?: string;
  gas_price?: string;
  marketplace?: string; // OpenSea, Rarible, etc.
  created_at: Date;
}

// ================================
// USER INTERACTIONS & PURCHASES
// ================================

interface UserComicAccess {
  id: string;
  user_profile_id: string;
  comic_id: string;
  access_type: 'purchase' | 'rental' | 'nft_ownership' | 'subscription' | 'free' | 'gift';
  purchase_transaction_id?: string;
  nft_ownership_id?: string;
  granted_at: Date;
  expires_at?: Date; // For rentals or subscriptions
  access_level: 'full' | 'preview'; // Full comic or preview pages only
  download_allowed: boolean;
  offline_access: boolean;
  created_at: Date;
}

interface UserReadingProgress {
  id: string;
  user_profile_id: string;
  comic_id: string;
  current_page: number;
  total_pages: number;
  completion_percentage: number;
  reading_time_minutes: number;
  last_read_at: Date;
  is_completed: boolean;
  is_bookmarked: boolean;
  created_at: Date;
  updated_at: Date;
}

interface ReadingSession {
  id: string;
  user_profile_id: string;
  comic_id: string;
  session_start: Date;
  session_end?: Date;
  pages_read: number;
  time_spent_seconds: number;
  device_type: 'mobile' | 'tablet' | 'desktop';
  reading_mode: 'single_page' | 'double_page' | 'continuous_scroll';
}

// ================================
// REVIEWS & SOCIAL FEATURES
// ================================

interface ComicReview {
  id: string;
  user_profile_id: string;
  comic_id: string;
  rating: number; // 1-5
  title?: string;
  review_text?: string;
  is_verified_purchase: boolean;
  helpful_count: number;
  report_count: number;
  status: 'active' | 'hidden' | 'reported' | 'deleted';
  created_at: Date;
  updated_at: Date;
}

interface ReviewHelpful {
  id: string;
  review_id: string;
  user_profile_id: string;
  is_helpful: boolean;
  created_at: Date;
}

interface UserFollowing {
  id: string;
  follower_user_id: string;
  following_user_id: string;
  following_type: 'user' | 'creator' | 'series';
  notification_enabled: boolean;
  created_at: Date;
}

interface UserLibrary {
  id: string;
  user_profile_id: string;
  name: string; // "Reading", "Completed", "Wishlist", "Custom Collection"
  description?: string;
  is_public: boolean;
  is_default: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

interface LibraryItem {
  id: string;
  user_library_id: string;
  comic_id: string;
  added_at: Date;
  sort_order?: number;
}

// ================================
// NOTIFICATIONS & MESSAGING
// ================================

interface Notification {
  id: string;
  user_profile_id: string;
  type: 'comic_release' | 'payment_received' | 'nft_minted' | 'review_posted' | 'creator_update' | 'system_alert';
  title: string;
  message: string;
  action_url?: string;
  data?: Record<string, any>;
  is_read: boolean;
  is_archived: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  delivery_method: ('push' | 'email' | 'in_app')[];
  scheduled_for?: Date;
  sent_at?: Date;
  created_at: Date;
}

// ================================
// PLATFORM CONFIGURATION
// ================================

interface PlatformConfig {
  id: string;
  key: string;
  value: string;
  value_type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  is_public: boolean; // Can be exposed to frontend
  environment: 'all' | 'development' | 'staging' | 'production';
  updated_by: string; // Admin user ID
  updated_at: Date;
}

interface ExchangeRate {
  id: string;
  from_currency: string;
  to_currency: string;
  rate: string;
  source: string; // API provider
  confidence_score?: number;
  created_at: Date;
}

interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address: string;
  user_agent: string;
  created_at: Date;
}

// ================================
// ANALYTICS & REPORTING
// ================================

interface ComicAnalytics {
  id: string;
  comic_id: string;
  date: Date;
  views: number;
  unique_viewers: number;
  purchases: number;
  revenue_nwt: string;
  revenue_usd: string;
  completion_rate: number;
  average_rating: number;
  download_count: number;
  created_at: Date;
}

interface CreatorAnalytics {
  id: string;
  creator_profile_id: string;
  period_start: Date;
  period_end: Date;
  total_views: number;
  total_purchases: number;
  total_revenue_nwt: string;
  total_revenue_usd: string;
  new_followers: number;
  top_performing_comic_id?: string;
  engagement_rate: number;
  created_at: Date;
}

// ================================
// TYPE EXPORTS
// ================================

export type {
  // Auth & Identity
  AuthUser,
  AuthSession,
  PasswordReset,
  
  // User Profiles
  UserProfile,
  UserPreferences,
  NotificationSettings,
  PrivacySettings,
  
  // Financial
  UserWallet,
  WalletAddress,
  NWTTransaction,
  PaymentMethod,
  Payment,
  
  // Creator System
  CreatorProfile,
  SocialLinks,
  TaxInformation,
  Address,
  CreatorWallet,
  PayoutMethod,
  CreatorEarning,
  CreatorPayout,
  
  // Content
  ComicSeries,
  SeriesMetadata,
  Comic,
  ComicPricing,
  ComicMetadata,
  ComicPage,
  
  // NFT & Blockchain
  ComicNFT,
  NFTMintConfig,
  NFTOwnership,
  NFTTransaction,
  
  // User Interactions
  UserComicAccess,
  UserReadingProgress,
  ReadingSession,
  
  // Social Features
  ComicReview,
  ReviewHelpful,
  UserFollowing,
  UserLibrary,
  LibraryItem,
  
  // System
  Notification,
  PlatformConfig,
  ExchangeRate,
  AuditLog,
  
  // Analytics
  ComicAnalytics,
  CreatorAnalytics
};