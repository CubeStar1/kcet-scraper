"use client";

import { useState, useEffect } from 'react';
import useUser  from '@/app/hook/useUser';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Suggestion {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [newSuggestion, setNewSuggestion] = useState('');
  const { data: user } = useUser();
  const supabase = createSupabaseBrowser();
  const { toast } = useToast();

  useEffect(() => {
    fetchSuggestions();
  }, []);

  async function fetchSuggestions() {
    const { data, error } = await supabase
      .from('suggestions')
      .select('*')
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

    const { data, error } = await supabase
      .from('suggestions')
      .insert({ content: newSuggestion, user_id: user.id })
      .select();

    if (error) {
      console.error('Error submitting suggestion:', error);
      toast({
        title: "Error",
        description: "Failed to submit suggestion. Please try again.",
        variant: "destructive",
      });
    } else {
      setNewSuggestion('');
      fetchSuggestions();
      toast({
        title: "Success",
        description: "Your suggestion has been submitted.",
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
              disabled={!user}
            >
              Submit Suggestion
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
                Submitted on {new Date(suggestion.created_at).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}