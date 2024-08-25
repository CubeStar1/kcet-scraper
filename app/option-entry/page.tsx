'use client'

import React, { useState, useEffect, useRef } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { X, ChevronDown, ChevronUp, RefreshCw, Plus } from 'lucide-react'
import { collegeCodes } from '@/lib/colleges'
import { createSupabaseBrowser } from "@/lib/supabase/client";
import useUser from '../hook/useUser'
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from '@/components/ui/scroll-area'

const supabase = createSupabaseBrowser();

const getCourseName = (code: string) => {
  const disciplines: { [key: string]: string } = {
    'AI': 'Artificial Intelligence',
    'CE': 'Civil Engineering',
    'CS': 'Computer Science',
    'EC': 'Electronics and Communication',
    'ME': 'Mechanical Engineering'
  }
  const discipline = code.slice(-2)
  return disciplines[discipline] || 'Unknown Course'
}

type Option = {
  id: string
  courseCode: string
}

type DraggableCourseProps = {
  code: string
}

const DraggableCourse: React.FC<DraggableCourseProps> = ({ code }) => {
  const ref = useRef<HTMLLIElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'course',
    item: { code },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    if (ref.current) {
      drag(ref);
    }
  }, [ref, drag]);

  return (
    <li
      ref={ref}
      className={`bg-secondary p-3 rounded-md shadow-sm cursor-move ${isDragging ? 'opacity-50' : ''}`}
    >
      <span className="font-semibold">{code}</span> - {getCourseName(code)}
    </li>
  );
};

type DroppableOptionProps = {
  option: Option
  index: number
  onDrop: (code: string, index: number) => void
  onDelete: (index: number) => void
  onMoveUp: (index: number) => void
  onMoveDown: (index: number) => void
}

const DroppableOption: React.FC<DroppableOptionProps> = ({ option, index, onDrop, onDelete, onMoveUp, onMoveDown }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [{ isOver }, drop] = useDrop(() => ({
      accept: 'course',
      drop: (item: { code: string }) => onDrop(item.code, index),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }));

    useEffect(() => {
      if (ref.current) {
        drop(ref.current);
      }
    }, [ref, drop]);

    return (
      <div
        ref={ref}
        className={`p-3 rounded-md border-2 ${
          isOver ? 'border-primary bg-primary/10' : 'border-secondary'
        }`}
      >
      <div className="flex justify-between items-center mb-2">
        <p>Option {index + 1}</p>
        <div className="space-x-2">
          <Button size="sm" variant="ghost" onClick={() => onMoveUp(index)} disabled={index === 0}>
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onMoveDown(index)} disabled={index === 4}>
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete(index)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {option.courseCode ? (
        <div className="bg-secondary p-2 rounded-md">
          <span className="font-semibold">{option.courseCode}</span> - {getCourseName(option.courseCode)}
        </div>
      ) : (
        <div className="bg-muted p-2 rounded-md">Drag a course here</div>
      )}
    </div>
  )
}

export default function Component() {
  const { toast } = useToast();
  const { data: user, isLoading: isUserLoading } = useUser()
  const [options, setOptions] = useState<Option[]>(Array(5).fill(null).map((_, index) => ({
    id: `option-${index + 1}`,
    courseCode: '',
  })))
  const [savedOptions, setSavedOptions] = useState<Option[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [visibleCourses, setVisibleCourses] = useState(50)
  const [filteredCourses, setFilteredCourses] = useState(collegeCodes)

  useEffect(() => {
    if (user) {
      fetchSavedOptions()
    }
  }, [user])

  useEffect(() => {
    const filtered = collegeCodes.filter(code => 
      code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCourseName(code).toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCourses(filtered)
    setVisibleCourses(50)
  }, [searchTerm])

  const handleDrop = (code: string, optionIndex: number) => {
    setOptions(prevOptions => {
      const newOptions = [...prevOptions]
      newOptions[optionIndex] = {
        id: `option-${optionIndex + 1}`,
        courseCode: code,
      }
      return newOptions
    })
  }

  const handleDelete = (index: number) => {
    setOptions(prevOptions => {
      const newOptions = [...prevOptions]
      newOptions[index] = { id: `option-${index + 1}`, courseCode: '' }
      return newOptions
    })
  }

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      setOptions(prevOptions => {
        const newOptions = [...prevOptions]
        ;[newOptions[index - 1], newOptions[index]] = [newOptions[index], newOptions[index - 1]]
        return newOptions
      })
    }
  }

  const handleMoveDown = (index: number) => {
    if (index < options.length - 1) {
      setOptions(prevOptions => {
        const newOptions = [...prevOptions]
        ;[newOptions[index], newOptions[index + 1]] = [newOptions[index + 1], newOptions[index]]
        return newOptions
      })
    }
  }

  const fetchSavedOptions = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('option_entry')
        .select('*')
        .order('order_num')

      if (error) throw error

      setSavedOptions(data.map(item => ({
        id: item.id,
        courseCode: item.course_code
      })))
      toast({
        title: 'Saved options fetched',
        description: 'Your saved options have been fetched successfully.',
      })
    } catch (error) {
      console.error('Error fetching saved options:', error)
      // You can add an error message or notification here
    }
  }

  const handleSave = async () => {
    if (isUserLoading || !user) {
      console.error('User not loaded or not authenticated')
      // You can add an error message or notification here
      return
    }

    try {
      // First, delete all existing options for this user
      const { error: deleteError } = await supabase
        .from('option_entry')
        .delete()
        .match({ user_id: user.id })

      if (deleteError) throw deleteError

      // Then, insert the new options
      const { data, error } = await supabase
        .from('option_entry')
        .insert(options.map((option, index) => ({
          user_id: user.id,
          order_num: index + 1,
          course_code: option.courseCode
        })))

      if (error) throw error

      console.log('Options saved successfully:', data)
      // Refresh the saved options display
      await fetchSavedOptions()
      // You can add a success message or notification here
    } catch (error) {
      console.error('Error saving options:', error)
      // You can add an error message or notification here
    }
  }

  const handleReset = () => {
    setOptions(Array(5).fill(null).map((_, index) => ({
      id: `option-${index + 1}`,
      courseCode: '',
    })))
  }
  const handleAddOption = () => {
    setOptions(prevOptions => [
      ...prevOptions,
      {
        id: `option-${prevOptions.length + 1}`,
        courseCode: '',
      }
    ])
  }

  const loadMore = () => {
    setVisibleCourses(prev => Math.min(prev + 50, filteredCourses.length))
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Option Entry Portal</h1>
        <p className="text-sm text-muted-foreground pb-3">
          Drag and drop the courses into the options you want to select.
          It is recommended to use a desktop or laptop for the best experience.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Courses</CardTitle>
            </CardHeader>
            <ScrollArea>
              <CardContent>
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-4"
                />
                <ul className="space-y-2 max-h-[62vh] overflow-y-auto scrollbar-hide">
                  {filteredCourses.slice(0, visibleCourses).map((code) => (
                    <DraggableCourse key={code} code={code} />
                  ))}
                </ul>
                {visibleCourses < filteredCourses.length && (
                  <Button onClick={loadMore} className="mt-4 w-full">
                    Load More
                  </Button>
                )}
              </CardContent>
            </ScrollArea>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto scrollbar-hide">
                {options.map((option, index) => (
                  <DroppableOption
                    key={option.id}
                    option={option}
                    index={index}
                    onDrop={handleDrop}
                    onDelete={handleDelete}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                  />
                ))}
              </div>
              <Button onClick={handleAddOption} className="mt-4 w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Option
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Saved Options
                <Button onClick={fetchSavedOptions} variant="ghost" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 max-h-[70vh] overflow-y-auto scrollbar-hide">
                {savedOptions.map((option, index) => (
                  <li key={option.id} className="bg-secondary p-3 rounded-md">
                    <span className="font-semibold">{index + 1}. {option.courseCode}</span> - {getCourseName(option.courseCode)}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <Button onClick={handleReset} variant="outline">Reset Options</Button>
          <Button onClick={handleSave}>Save Options</Button>
        </div>
      </div>
    </DndProvider>
  )
}