// app/index.tsx
import {ScrollView, View} from 'react-native';
import HeroJourney from '@/components/HeroJourney';
import HeroStats from "@/components/HeroStats";
import Features from "@/components/Features";
import WhyChoose from "@/components/WhyChoose";
import CTASection from "@/components/CTASection";
import EmergencyBar from "@/components/EmergencyBar";

export default function HomeScreen() {
    return (
        <>
        <ScrollView showsVerticalScrollIndicator={false}>
            <HeroJourney />
            <HeroStats/>
        <Features/>
        <WhyChoose/>
        <CTASection/>

        </ScrollView>
            <View style={{ height: 40 }} />

            <EmergencyBar   />
        </>
    );
}
