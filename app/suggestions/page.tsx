"use client";

import { useState, useEffect } from 'react';
import useUser from '@/app/hook/useUser';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { addDays, startOfDay } from 'date-fns';
import { User } from '@supabase/supabase-js';

interface Suggestion {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user: User;  // Add this line
}

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [newSuggestion, setNewSuggestion] = useState('');
  const { data: user } = useUser();
  const supabase = createSupabaseBrowser();
  const { toast } = useToast();
  const [dailySuggestionCount, setDailySuggestionCount] = useState(0);

  useEffect(() => {
    fetchSuggestions();
    if (user) {
      fetchDailySuggestionCount();
    }
  }, [user]);

  async function fetchDailySuggestionCount() {
    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);
    
    const { data, error } = await supabase
      .from('suggestions')
      .select('id')
      .eq('user_id', user?.id)
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString());

    if (error) {
      console.error('Error fetching daily suggestion count:', error);
    } else {
      setDailySuggestionCount(data.length);
    }
  }

  async function fetchSuggestions() {
    const { data, error } = await supabase
      .from('suggestions')
      .select('*, user:users(email)')  // Modified this line
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch suggestions. Please try again.",
        variant: "destructive",
      });
    } else {
      setSuggestions(data || []);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a suggestion.",
        variant: "destructive",
      });
      return;
    }

    if (!newSuggestion.trim()) {
      toast({
        title: "Error",
        description: "Suggestion cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    if (dailySuggestionCount >= 3) {
      toast({
        title: "Limit Reached",
        description: "You've reached the daily limit of 3 suggestions.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Insert the suggestion
      const { error: suggestionError } = await supabase
        .from('suggestions')
        .insert({ content: newSuggestion.trim(), user_id: user.id });

      // Increase the user's search limit
      const response = await fetch('/api/search-limit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id, action: 'suggestion_reward' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update search limit');
      }

      const data = await response.json();

      setNewSuggestion('');
      fetchSuggestions();
      setDailySuggestionCount(prevCount => prevCount + 1);
      toast({
        title: "Success",
        description: `Your suggestion has been submitted. Your remaining searches: ${data.remainingSearches}`,
      });
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      toast({
        title: "Error",
        description: "Failed to submit suggestion. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Suggestions</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Submit a Suggestion</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={newSuggestion}
              onChange={(e) => setNewSuggestion(e.target.value)}
              placeholder="Enter your suggestion here..."
              className="w-full"
              rows={4}
            />
            <Button 
              type="submit" 
              className="w-full"
              disabled={!user || !newSuggestion.trim() || dailySuggestionCount >= 3}
            >
              Submit Suggestion ({3 - dailySuggestionCount} left today)
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <Card key={suggestion.id}>
            <CardContent className="pt-6">
              <p className="mb-2">{suggestion.content}</p>
              <p className="text-sm text-muted-foreground">
                Submitted by {suggestion.user.email} on {new Date(suggestion.created_at).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}