import React, { useState, useEffect } from 'react';

const AvailabilityForm = ({ onSave, onCancel, existingAvailability = {} }) => {
  // List of days
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Time slots for selection (30 min intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        slots.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  
  // List of common timezones
  const timezones = [
    'UTC', 'GMT', 'EST', 'CST', 'MST', 'PST', 
    'EDT', 'CDT', 'MDT', 'PDT', 
    'Asia/Kolkata', 'Europe/London', 'Europe/Paris', 
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Asia/Tokyo', 'Asia/Shanghai', 'Australia/Sydney'
  ];

  // Initialize availability state from existing data or with defaults
  const initializeAvailabilityState = () => {
    const schedule = {};
    
    daysOfWeek.forEach(day => {
      if (existingAvailability?.schedule && existingAvailability.schedule[day]) {
        schedule[day] = existingAvailability.schedule[day];
      } else {
        schedule[day] = {
          isAvailable: false,
          timeSlots: [{ start: '09:00', end: '17:00' }]
        };
      }
    });

    return {
      timezone: existingAvailability?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      schedule
    };
  };

  const [availabilityData, setAvailabilityData] = useState(initializeAvailabilityState);
  const [error, setError] = useState('');

  // Toggle day availability
  const toggleDayAvailability = (day) => {
    setAvailabilityData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          isAvailable: !prev.schedule[day].isAvailable
        }
      }
    }));
  };

  // Add a new time slot to a day
  const addTimeSlot = (day) => {
    const daySchedule = availabilityData.schedule[day];
    
    if (daySchedule.timeSlots.length >= 5) {
      setError(`Maximum 5 time slots allowed for ${day}`);
      return;
    }
    
    setAvailabilityData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          timeSlots: [
            ...prev.schedule[day].timeSlots,
            { start: '09:00', end: '17:00' }
          ]
        }
      }
    }));
    
    setError('');
  };

  // Remove a time slot
  const removeTimeSlot = (day, index) => {
    const updatedTimeSlots = [...availabilityData.schedule[day].timeSlots];
    updatedTimeSlots.splice(index, 1);
    
    setAvailabilityData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          timeSlots: updatedTimeSlots
        }
      }
    }));
  };

  // Update a time slot
  const updateTimeSlot = (day, index, field, value) => {
    const updatedTimeSlots = [...availabilityData.schedule[day].timeSlots];
    updatedTimeSlots[index] = {
      ...updatedTimeSlots[index],
      [field]: value
    };
    
    setAvailabilityData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          timeSlots: updatedTimeSlots
        }
      }
    }));
  };

  // Update timezone
  const updateTimezone = (value) => {
    setAvailabilityData(prev => ({
      ...prev,
      timezone: value
    }));
  };

  // Validate time slots (end time should be after start time)
  const validateTimeSlots = () => {
    let isValid = true;
    
    daysOfWeek.forEach(day => {
      if (availabilityData.schedule[day].isAvailable) {
        availabilityData.schedule[day].timeSlots.forEach(slot => {
          if (slot.start >= slot.end) {
            isValid = false;
            setError(`Invalid time slot for ${day}: End time must be after start time`);
          }
        });
      }
    });
    
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateTimeSlots()) {
      return;
    }
    
    onSave(availabilityData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Set Your Availability</h2>
      <p className="text-gray-600 mb-4">
        Configure when you're available for mentorship sessions.
      </p>
      
      <form onSubmit={handleSubmit}>
        {/* Timezone Selection */}
        <div className="mb-5">
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
            Your Timezone
          </label>
          <select
            id="timezone"
            value={availabilityData.timezone}
            onChange={(e) => updateTimezone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {timezones.map((timezone, index) => (
              <option key={index} value={timezone}>
                {timezone}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-500">
            All times below are in this timezone.
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        {/* Weekly Schedule */}
        <div className="space-y-5">
          {daysOfWeek.map((day) => (
            <div key={day} className="border border-gray-200 rounded-md p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <input
                    id={`available-${day}`}
                    type="checkbox"
                    checked={availabilityData.schedule[day].isAvailable}
                    onChange={() => toggleDayAvailability(day)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`available-${day}`} className="text-gray-700 font-medium">
                    {day}
                  </label>
                </div>
                
                {availabilityData.schedule[day].isAvailable && (
                  <button
                    type="button"
                    onClick={() => addTimeSlot(day)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
                    disabled={availabilityData.schedule[day].timeSlots.length >= 5}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Time Slot
                  </button>
                )}
              </div>
              
              {availabilityData.schedule[day].isAvailable && (
                <div className="space-y-3 pl-6">
                  {availabilityData.schedule[day].timeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <select
                        value={slot.start}
                        onChange={(e) => updateTimeSlot(day, index, 'start', e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <span className="text-gray-500">to</span>
                      <select
                        value={slot.end}
                        onChange={(e) => updateTimeSlot(day, index, 'end', e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(day, index)}
                        className="text-red-600 hover:text-red-800 ml-1"
                        disabled={availabilityData.schedule[day].timeSlots.length <= 1}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700"
          >
            Save Availability
          </button>
        </div>
      </form>
    </div>
  );
};

export default AvailabilityForm;