'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar } from '@/components/ui/calendar';
import { Modal } from '@/components/ui/modal';
import { CelebrationForm, CelebrationFormData } from '@/components/celebration-form';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { addMonths } from 'date-fns';
import { SmallCalendar } from "@/components/SmallCalendar";
import { CalendarTile } from "@/components/Calendar/CalendarTile";
import { CalendarContainer } from "@/components/Calendar/CalendarContainer";

interface User {
  id: string;
  name: string | null;
  email: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          router.push('/login');
          return;
        }
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleAddCelebration = () => {
    setSelectedDate(undefined);
    setIsModalOpen(true);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(undefined);
  };

  const handleSubmitCelebration = async (data: CelebrationFormData) => {
    try {
      // TODO: Implement API call to save celebration
      console.log('Celebration data:', data);
      setIsModalOpen(false);
      setSelectedDate(undefined);
    } catch (error) {
      console.error('Failed to save celebration:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F2F8] flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="flex justify-between items-center px-8 bg-white">
          <div className="flex items-center space-x-4">
            <Image src="/celebration-countdown-logo.png" alt="Celebration Countdown" width={200} height={61} />
          </div>
          <Button
            onClick={handleSignOut}
            className="bg-[#103242] hover:bg-[#103242]/90 text-white"
          >
            Sign Out
          </Button>
        </div>
      </div>
      <div className="min-h-screen bg-[#F5F2F8]">
        <div className="container mx-auto px-4 py-8">
          {/* Calendar Section */}
          <CalendarContainer>
            <div className="grid grid-cols-1 lg:grid-cols-8 gap-8">
              <div className="lg:col-span-5">
                <Calendar
                  selectedDate={selectedDate}
                  onSelect={(date) => date && handleDateClick(date)}
                  onAddCelebration={handleAddCelebration}
                  onDateClick={handleDateClick}
                />
              </div>

              <div className="lg:col-span-3 lg:pl-[30px]">
                <div className="space-y-2">
                  {/* <SmallCalendar
                    monthOffset={1}
                    onSelect={(date) => date && handleDateClick(date)}
                    onAddCelebration={handleAddCelebration}
                    onDateClick={handleDateClick}
                  />
                  <SmallCalendar
                    monthOffset={2}
                    onSelect={(date) => date && handleDateClick(date)}
                    onAddCelebration={handleAddCelebration}
                    onDateClick={handleDateClick}
                  />
                  <SmallCalendar
                    monthOffset={3}
                    onSelect={(date) => date && handleDateClick(date)}
                    onAddCelebration={handleAddCelebration}
                    onDateClick={handleDateClick}
                  /> */}
                </div>
              </div>
            </div>
          </CalendarContainer>
        </div>
      </div>

      {/* Celebration Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Celebration"
      >
        <CelebrationForm
          onSubmit={handleSubmitCelebration}
          onCancel={handleCloseModal}
          selectedDate={selectedDate}
        />
      </Modal>
    </>
  );
} 