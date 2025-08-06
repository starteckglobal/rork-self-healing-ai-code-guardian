import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  Check,
  X,
  Crown,
  ArrowLeft,
  CreditCard,
  Code,
  Users,
  Building,
  Star,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import { LucideIcon } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isMobile = width < 768;
const isTablet = width >= 768 && width < 1024;

type PlanType = 'developer' | 'professional' | 'business' | 'enterprise' | 'enterprise-plus';
type BillingCycle = 'monthly' | 'yearly';

interface Plan {
  name: string;
  description: string;
  tag: string;
  monthlyPrice: number;
  yearlyPrice: number;
  icon: LucideIcon;
  color: string;
  gradient: readonly [string, string];
  popular?: boolean;
  features: string[];
  buttonText: string;
  customPricing?: boolean;
}

interface PlanFeature {
  name: string;
  developer: boolean | string;
  professional: boolean | string;
  business: boolean | string;
  enterprise: boolean | string;
  enterprisePlus: boolean | string;
}



const planFeatures: PlanFeature[] = [
  {
    name: 'Repositories Monitored',
    developer: '3',
    professional: '15',
    business: '100',
    enterprise: 'Unlimited',
    enterprisePlus: 'Unlimited',
  },
  {
    name: 'AI Analysis Runs/Month',
    developer: '50',
    professional: '500',
    business: '2,000',
    enterprise: 'Unlimited',
    enterprisePlus: 'Unlimited',
  },
  {
    name: 'Auto-fix Severity',
    developer: 'Manual only',
    professional: 'Low/Medium',
    business: 'All levels',
    enterprise: 'All + instant',
    enterprisePlus: 'All + instant',
  },
  {
    name: 'Real-time Monitoring',
    developer: false,
    professional: true,
    business: true,
    enterprise: true,
    enterprisePlus: true,
  },
  {
    name: 'Pull Request Automation',
    developer: false,
    professional: true,
    business: true,
    enterprise: true,
    enterprisePlus: true,
  },
  {
    name: 'Custom AI Models',
    developer: false,
    professional: false,
    business: false,
    enterprise: true,
    enterprisePlus: true,
  },
  {
    name: 'SSO Integration',
    developer: false,
    professional: false,
    business: true,
    enterprise: true,
    enterprisePlus: true,
  },
  {
    name: 'Compliance Reporting',
    developer: false,
    professional: false,
    business: true,
    enterprise: true,
    enterprisePlus: true,
  },
  {
    name: 'Support Level',
    developer: 'Community',
    professional: 'Email',
    business: 'Priority + CSM',
    enterprise: '24/7 Phone',
    enterprisePlus: 'Dedicated TAM',
  },
];

const professionalServices = [
  { name: 'Implementation & Setup', price: '$5,000-15,000', description: 'Complete setup and configuration' },
  { name: 'Custom Rule Development', price: '$2,500/month', description: 'Tailored AI rules for your codebase' },
  { name: 'Advanced Training', price: '$1,500/session', description: 'Team training and best practices' },
  { name: 'Migration Services', price: '$3,000-10,000', description: 'Migrate from existing tools' },
];

const usageOverages = [
  { name: 'Extra Repositories', price: '$15/repo/month', description: 'Additional repository monitoring' },
  { name: 'Additional Analysis Runs', price: '$0.50/run', description: 'Beyond plan limits' },
  { name: 'Premium AI Models', price: '$99/month', description: 'Access to latest AI models' },
];

const plans: Record<PlanType, Plan> = {
  developer: {
    name: 'Developer',
    description: 'Perfect for individual developers, side projects, small startups',
    tag: 'Perfect for: Individual developers, side projects, small startups',
    monthlyPrice: 49,
    yearlyPrice: 39,
    icon: Code,
    color: '#10B981',
    gradient: ['#10B981', '#059669'] as const,
    buttonText: 'Get Started',
    features: [
      '3 repositories monitored',
      'Basic AI analysis (security, performance, quality)',
      'Manual fix suggestions (no auto-apply)',
      'Email notifications',
      'Basic dashboard',
      'Community support',
      '50 analysis runs/month'
    ],
  },
  professional: {
    name: 'Professional',
    description: 'Perfect for small development teams (2-10 developers)',
    tag: 'Perfect for: Small development teams (2-10 developers)',
    monthlyPrice: 199,
    yearlyPrice: 159,
    icon: Users,
    color: '#3B82F6',
    gradient: ['#3B82F6', '#2563EB'] as const,
    popular: true,
    buttonText: 'Get Started',
    features: [
      '15 repositories monitored',
      'Advanced AI analysis (multi-model: Claude + GPT-4)',
      'Auto-fix for low/medium severity issues',
      'Pull request automation',
      'Real-time monitoring',
      'Team notifications + Slack integration',
      'Advanced analytics dashboard',
      'Email support',
      '500 analysis runs/month',
      'Cost savings tracking'
    ],
  },
  business: {
    name: 'Business',
    description: 'Perfect for growing companies (10-50 developers)',
    tag: 'Perfect for: Growing companies (10-50 developers)',
    monthlyPrice: 799,
    yearlyPrice: 639,
    icon: Building,
    color: '#F97316',
    gradient: ['#F97316', '#EA580C'] as const,
    buttonText: 'Get Started',
    features: [
      '100 repositories monitored',
      'Enterprise AI analysis (all models + custom rules)',
      'Auto-fix for ALL severity levels (with review)',
      'Advanced pull request workflows',
      '24/7 live monitoring',
      'Custom notification channels',
      'Executive reporting & ROI dashboards',
      'Priority support + dedicated CSM',
      '2,000 analysis runs/month',
      'SSO integration',
      'Compliance reporting (SOC 2, GDPR)'
    ],
  },
  enterprise: {
    name: 'Enterprise',
    description: 'Perfect for large enterprises (50+ developers)',
    tag: 'Perfect for: Large enterprises (50+ developers)',
    monthlyPrice: 2499,
    yearlyPrice: 1999,
    icon: Crown,
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#7C3AED'] as const,
    buttonText: 'Contact Sales',
    features: [
      'Unlimited repositories',
      'Custom AI model training on your codebase',
      'Instant auto-fix deployment (with safeguards)',
      'Advanced workflow automation',
      'Real-time security threat prevention',
      'Multi-team management',
      'Custom integrations (Jira, ServiceNow, etc.)',
      '24/7 phone + dedicated support',
      'Unlimited analysis runs',
      'Advanced security & compliance',
      'Custom SLA (99.9% uptime)',
      'On-premise deployment option'
    ],
  },
  'enterprise-plus': {
    name: 'Enterprise Plus',
    description: 'Perfect for Fortune 500, highly regulated industries',
    tag: 'Perfect for: Fortune 500, highly regulated industries',
    monthlyPrice: 10000,
    yearlyPrice: 8000,
    icon: Star,
    color: '#1F2937',
    gradient: ['#1F2937', '#111827'] as const,
    buttonText: 'Contact Sales',
    customPricing: true,
    features: [
      'Everything in Enterprise',
      'Dedicated infrastructure',
      'Custom AI model development',
      'White-label options',
      'Advanced compliance (HIPAA, FedRAMP, etc.)',
      'Custom integrations & APIs',
      'Dedicated technical account manager',
      'Professional services & training',
      'Custom contract terms'
    ],
  },
};

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('professional');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showROI, setShowROI] = useState(false);
  const [showAddOns, setShowAddOns] = useState(false);

  const handleSubscribe = async (plan: PlanType) => {
    setProcessingPayment(true);
    
    try {
      // Simulate Stripe payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would integrate with Stripe
      // const stripe = await stripePromise;
      // const { error } = await stripe.redirectToCheckout({
      //   sessionId: 'session_id_from_your_backend'
      // });
      
      Alert.alert(
        'Payment Successful!',
        `You have successfully subscribed to the ${plans[plan].name} plan.`,
        [
          {
            text: 'Continue',
            onPress: () => router.back(),
          },
        ]
      );
    } catch {
      Alert.alert(
        'Payment Failed',
        'There was an error processing your payment. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setProcessingPayment(false);
    }
  };

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check size={16} color="#10B981" />
      ) : (
        <X size={16} color="#EF4444" />
      );
    }
    return <Text style={styles.featureValue}>{value}</Text>;
  };

  const PlanCard = ({ planKey }: { planKey: PlanType }) => {
    const plan = plans[planKey];
    const Icon = plan.icon;
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
    const yearlyPrice = plan.yearlyPrice * 12;
    const yearlyDiscount = billingCycle === 'yearly' ? Math.round((1 - (plan.yearlyPrice * 12) / (plan.monthlyPrice * 12)) * 100) : 0;
    const yearlySavings = billingCycle === 'yearly' ? (plan.monthlyPrice * 12) - yearlyPrice : 0;

    return (
      <TouchableOpacity
        style={[
          styles.planCard,
          selectedPlan === planKey && styles.selectedPlanCard,
          plan.popular && styles.popularPlan,
        ]}
        onPress={() => setSelectedPlan(planKey)}
        testID={`plan-${planKey}`}
      >
        {plan.popular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>Most Popular</Text>
          </View>
        )}
        
        <LinearGradient
          colors={[...plan.gradient]}
          style={styles.planIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Icon size={24} color="white" />
        </LinearGradient>

        <Text style={styles.planName}>{plan.name}</Text>
        <Text style={styles.planTag}>{plan.tag}</Text>

        <View style={styles.priceContainer}>
          {plan.customPricing ? (
            <Text style={styles.customPrice}>Starting at ${(price / 1000).toFixed(0)}k</Text>
          ) : billingCycle === 'yearly' ? (
            <>
              <Text style={styles.price}>${yearlyPrice.toLocaleString()}</Text>
              <Text style={styles.pricePeriod}>/year</Text>
            </>
          ) : (
            <>
              <Text style={styles.price}>${price}</Text>
              <Text style={styles.pricePeriod}>/month</Text>
            </>
          )}
        </View>

        {billingCycle === 'yearly' && yearlyDiscount > 0 && (
          <Text style={styles.discount}>Save ${yearlySavings.toLocaleString()}/year (20% off)</Text>
        )}

        <View style={styles.featuresContainer}>
          {plan.features.slice(0, 5).map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Check size={14} color="#10B981" />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
          {plan.features.length > 5 && (
            <Text style={styles.moreFeatures}>+{plan.features.length - 5} more features</Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.selectButton,
            { backgroundColor: plan.color },
          ]}
          onPress={() => handleSubscribe(planKey)}
          disabled={processingPayment}
        >
          {processingPayment && selectedPlan === planKey ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.selectButtonText}>
              {plan.buttonText}
            </Text>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Choose Your Plan',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#1E293B" />
              <Text style={styles.backButtonText}>Back to Dashboard</Text>
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>SHAi Pricing Tiers</Text>
          <Text style={styles.subtitle}>
            Choose the perfect plan for your team&apos;s AI-powered code protection needs
          </Text>
        </View>

        <View style={styles.billingToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              billingCycle === 'monthly' && styles.activeToggle,
            ]}
            onPress={() => setBillingCycle('monthly')}
          >
            <Text
              style={[
                styles.toggleText,
                billingCycle === 'monthly' && styles.activeToggleText,
              ]}
            >
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              billingCycle === 'yearly' && styles.activeToggle,
            ]}
            onPress={() => setBillingCycle('yearly')}
          >
            <Text
              style={[
                styles.toggleText,
                billingCycle === 'yearly' && styles.activeToggleText,
              ]}
            >
              Yearly
            </Text>
            <View style={styles.saveBadge}>
              <Text style={styles.saveText}>Save 20%</Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal={!isMobile}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.plansContainer,
            isMobile ? { flexDirection: 'column' } : { flexDirection: 'row' }
          ]}
        >
          <PlanCard planKey="developer" />
          <PlanCard planKey="professional" />
          <PlanCard planKey="business" />
          <PlanCard planKey="enterprise" />
          <PlanCard planKey="enterprise-plus" />
        </ScrollView>

        {/* Add-Ons Section */}
        <TouchableOpacity 
          style={styles.sectionHeader}
          onPress={() => setShowAddOns(!showAddOns)}
        >
          <Text style={styles.sectionTitle}>Add-Ons Available</Text>
          {showAddOns ? <ChevronUp size={20} color="#64748B" /> : <ChevronDown size={20} color="#64748B" />}
        </TouchableOpacity>
        
        {showAddOns && (
          <View style={styles.addOnsContainer}>
            <View style={styles.addOnCategory}>
              <Text style={styles.addOnCategoryTitle}>Professional Services</Text>
              {professionalServices.map((service, index) => (
                <View key={index} style={styles.addOnItem}>
                  <View style={styles.addOnInfo}>
                    <Text style={styles.addOnName}>{service.name}</Text>
                    <Text style={styles.addOnDescription}>{service.description}</Text>
                  </View>
                  <Text style={styles.addOnPrice}>{service.price}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.addOnCategory}>
              <Text style={styles.addOnCategoryTitle}>Usage Overages</Text>
              {usageOverages.map((overage, index) => (
                <View key={index} style={styles.addOnItem}>
                  <View style={styles.addOnInfo}>
                    <Text style={styles.addOnName}>{overage.name}</Text>
                    <Text style={styles.addOnDescription}>{overage.description}</Text>
                  </View>
                  <Text style={styles.addOnPrice}>{overage.price}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ROI Justification Section */}
        <TouchableOpacity 
          style={styles.sectionHeader}
          onPress={() => setShowROI(!showROI)}
        >
          <Text style={styles.sectionTitle}>ROI Justification - SHAI pays for itself</Text>
          {showROI ? <ChevronUp size={20} color="#64748B" /> : <ChevronDown size={20} color="#64748B" />}
        </TouchableOpacity>
        
        {showROI && (
          <View style={styles.roiContainer}>
            <Text style={styles.roiSubtitle}>SHAI prevents:</Text>
            <View style={styles.roiList}>
              <View style={styles.roiItem}>
                <Text style={styles.roiBullet}>•</Text>
                <Text style={styles.roiText}>Security breaches: Average cost $4.45M per breach</Text>
              </View>
              <View style={styles.roiItem}>
                <Text style={styles.roiBullet}>•</Text>
                <Text style={styles.roiText}>Developer time: 30-50% reduction in debugging time</Text>
              </View>
              <View style={styles.roiItem}>
                <Text style={styles.roiBullet}>•</Text>
                <Text style={styles.roiText}>Technical debt: Prevents $85,000+ annual costs per team</Text>
              </View>
              <View style={styles.roiItem}>
                <Text style={styles.roiBullet}>•</Text>
                <Text style={styles.roiText}>Downtime: Each hour costs $5,600-$900,000</Text>
              </View>
            </View>
            
            <View style={styles.roiExample}>
              <Text style={styles.roiExampleTitle}>Business Tier ROI Example ($799/month):</Text>
              <Text style={styles.roiExampleText}>• Prevents 1 security incident: Saves $50,000-500,000</Text>
              <Text style={styles.roiExampleText}>• Reduces debugging time by 40%: Saves $15,000/month</Text>
              <Text style={styles.roiExampleText}>• Prevents production issues: Saves $25,000/month</Text>
              <Text style={styles.roiExampleHighlight}>Monthly ROI: 4,900% - 6,200%</Text>
            </View>
          </View>
        )}

        <View style={styles.comparisonContainer}>
          <Text style={styles.featuresTitle}>Feature Comparison</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.featuresTable}>
              <View style={styles.tableHeader}>
                <Text style={[styles.featureHeaderText, { width: 150 }]}>Features</Text>
                <Text style={[styles.planHeaderText, { width: 100 }]}>Developer</Text>
                <Text style={[styles.planHeaderText, { width: 100 }]}>Professional</Text>
                <Text style={[styles.planHeaderText, { width: 100 }]}>Business</Text>
                <Text style={[styles.planHeaderText, { width: 100 }]}>Enterprise</Text>
                <Text style={[styles.planHeaderText, { width: 120 }]}>Enterprise+</Text>
              </View>
              
              {planFeatures.map((feature, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.featureName, { width: 150 }]}>{feature.name}</Text>
                  <View style={[styles.featureCell, { width: 100 }]}>
                    {renderFeatureValue(feature.developer)}
                  </View>
                  <View style={[styles.featureCell, { width: 100 }]}>
                    {renderFeatureValue(feature.professional)}
                  </View>
                  <View style={[styles.featureCell, { width: 100 }]}>
                    {renderFeatureValue(feature.business)}
                  </View>
                  <View style={[styles.featureCell, { width: 100 }]}>
                    {renderFeatureValue(feature.enterprise)}
                  </View>
                  <View style={[styles.featureCell, { width: 120 }]}>
                    {renderFeatureValue(feature.enterprisePlus)}
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.securityInfo}>
          <CreditCard size={20} color="#10B981" />
          <Text style={styles.securityText}>
            Secure payments powered by Stripe. Cancel anytime.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: isMobile ? 16 : 24,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: isMobile ? 24 : 32,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: isMobile ? 14 : 16,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 500,
  },
  billingToggle: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
    alignSelf: 'center',
  },
  toggleButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeToggle: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  activeToggleText: {
    color: '#1E293B',
  },
  saveBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  saveText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  plansContainer: {
    gap: 16,
    marginBottom: 40,
  },
  planCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    position: 'relative',
    width: isMobile ? '100%' : isTablet ? 280 : 240,
    marginHorizontal: isMobile ? 0 : 8,
  },
  selectedPlanCard: {
    borderColor: '#4F46E5',
  },
  popularPlan: {
    borderColor: '#8B5CF6',
  },
  popularBadge: {
    position: 'absolute',
    top: -1,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  planIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  planTag: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 16,
  },
  customPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#1E293B',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  moreFeatures: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  addOnsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addOnCategory: {
    marginBottom: 24,
  },
  addOnCategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  addOnItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  addOnInfo: {
    flex: 1,
  },
  addOnName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 4,
  },
  addOnDescription: {
    fontSize: 12,
    color: '#64748B',
  },
  addOnPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  roiContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  roiSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  roiList: {
    marginBottom: 20,
  },
  roiItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  roiBullet: {
    fontSize: 16,
    color: '#10B981',
    marginRight: 8,
    marginTop: 2,
  },
  roiText: {
    fontSize: 14,
    color: '#1E293B',
    flex: 1,
    lineHeight: 20,
  },
  roiExample: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  roiExampleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 8,
  },
  roiExampleText: {
    fontSize: 13,
    color: '#166534',
    marginBottom: 4,
  },
  roiExampleHighlight: {
    fontSize: 14,
    fontWeight: '700',
    color: '#166534',
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E293B',
  },
  pricePeriod: {
    fontSize: 16,
    color: '#64748B',
    marginLeft: 4,
  },
  discount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 20,
  },
  selectButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  selectedButton: {
    backgroundColor: '#4F46E5',
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  selectedButtonText: {
    color: 'white',
  },
  comparisonContainer: {
    marginBottom: 32,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 24,
  },
  featuresTable: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  featureHeaderText: {
    flex: 2,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  planHeaderText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    alignItems: 'center',
  },
  featureName: {
    flex: 2,
    fontSize: 14,
    color: '#1E293B',
  },
  featureCell: {
    flex: 1,
    alignItems: 'center',
  },
  featureValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  securityText: {
    fontSize: 14,
    color: '#64748B',
  },
});