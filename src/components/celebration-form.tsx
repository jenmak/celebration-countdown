'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CelebrationFormProps {
  onSubmit: (data: CelebrationFormData) => void;
  onCancel: () => void;
  selectedDate?: Date;
}

export interface CelebrationFormData {
  title: string;
  description: string;
  type: 'BIRTHDAY' | 'ANNIVERSARY' | 'HOLIDAY' | 'OTHER';
  date: string;
  time?: string;
  location?: string;
}

export function CelebrationForm({ onSubmit, onCancel, selectedDate }: CelebrationFormProps) {
  const [formData, setFormData] = useState<CelebrationFormData>({
    title: '',
    description: '',
    type: 'OTHER',
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
    time: '',
    location: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Type</Label>
        <Tabs
          defaultValue={formData.type}
          onValueChange={(value: CelebrationFormData['type']) =>
            setFormData({ ...formData, type: value })
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="BIRTHDAY">Birthday</TabsTrigger>
            <TabsTrigger value="ANNIVERSARY">Anniversary</TabsTrigger>
            <TabsTrigger value="HOLIDAY">Holiday</TabsTrigger>
            <TabsTrigger value="OTHER">Other</TabsTrigger>
          </TabsList>
          <TabsContent value="BIRTHDAY" className="mt-2">
            <p className="text-sm text-gray-500">Celebrate someone's special day</p>
          </TabsContent>
          <TabsContent value="ANNIVERSARY" className="mt-2">
            <p className="text-sm text-gray-500">Mark a significant milestone</p>
          </TabsContent>
          <TabsContent value="HOLIDAY" className="mt-2">
            <p className="text-sm text-gray-500">Remember important holidays</p>
          </TabsContent>
          <TabsContent value="OTHER" className="mt-2">
            <p className="text-sm text-gray-500">Any other special occasion</p>
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter celebration title"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter celebration description"
          required
        />
      </div>

      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="time">Time (Optional)</Label>
        <Input
          id="time"
          type="time"
          value={formData.time}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, time: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="location">Location (Optional)</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Enter celebration location"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="text-gray-600"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-[#8BC5E2] hover:bg-[#8BC5E2]/90 text-white"
        >
          Add Celebration
        </Button>
      </div>
    </form>
  );
} 