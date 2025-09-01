# Djure Admin - Competition Management System

A comprehensive admin interface for managing cerdas cermat (quiz) competitions built with React, TypeScript, and Supabase.

## Features

- **Competition Management**: Create and manage quiz competitions with custom settings
- **Question Management**: Add, edit, and organize open-ended questions for each competition
- **Participant Management**: Register participants with unique auth keys for access
- **Answer Tracking**: Monitor participant responses and competition progress
- **Admin Dashboard**: Full CRUD operations through an intuitive web interface

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **UI Library**: Mantine UI components
- **Database**: Supabase (PostgreSQL)
- **Build Tool**: Vite
- **Routing**: React Router
- **State Management**: Zustand

## Database Schema

The system uses the following tables:

1. **competitions** - Main competition details (name, description, duration_minutes)
2. **competitions_questions** - Questions for each competition
3. **competitions_participants** - Stores participant details (name, auth_key) for each competition
4. **competitions_answers** - Participant responses and scoring

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Supabase connection in `src/services/supabase.js`

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── features/
│   ├── Authentication/
│   ├── Competition/
│   │   ├── components/
│   │   ├── CompetitionForm.tsx
│   │   ├── CompetitionNav.tsx
│   │   └── CompetitionView.tsx
│   ├── Dashboard/
│   ├── Member/
│   └── Transaction/
├── services/
│   ├── authService.ts
│   ├── competitionService.ts
│   ├── memberService.ts
│   ├── participantService.ts
│   ├── questionService.ts
│   ├── answerService.ts
│   └── supabase.js
├── shared/
│   ├── CompetitionType.ts
│   ├── MemberType.ts
│   └── TransactionType.ts
├── UI/
│   ├── StatsCard.tsx
│   └── StatsCard.module.css
└── utils/
    ├── linkContainString.ts
    └── transactionFilter.ts
```

## Key Components

- **Competition Management**: Full CRUD for competitions with form validation
- **Question Editor**: Rich text editing for open-ended questions
- **Participant Registration**: Generate unique auth keys for participant access
- **Answer Tracking**: Real-time monitoring of participant progress and scores

## For Participants

Participants can join competitions through the public interface:

1. **Access Competition**: Visit `/public/competition/{competitionID}`
2. **Login**: Enter your auth key provided by the administrator
3. **Take Quiz**: Answer questions in the competition interface
4. **Submit Answers**: Your answers are automatically saved and scored

### Participant Routes
- `/public/competition/:id` - Competition landing page
- `/public/competition/:id/login` - Participant login
- `/public/competition/:id/quiz` - Competition quiz interface
