# AkquaintX Survey Tool

A modern, professional survey builder and response collection tool built with React, TypeScript, Vite, Radix UI, and Tailwind CSS.

## Features

### Survey Builder
- **Drag & Drop Interface**: Easily reorder questions with intuitive controls
- **Multiple Question Types**: 
  - Short text and long text responses
  - Multiple choice and checkbox options
  - Rating scales (1-10)
  - Email and number inputs
- **Question Management**: Add, edit, delete, and reorder questions
- **Survey Settings**: Configure completion requirements and display options
- **Real-time Preview**: See how your survey will look to respondents

### Survey Response System
- **Multi-step Flow**: Navigate through questions with progress tracking
- **Form Validation**: Ensure required fields are completed
- **Mobile Responsive**: Works seamlessly on all devices
- **Email Collection**: Optional email requirement for respondents
- **Success Confirmation**: Clear completion messaging

### Analytics & Results
- **Response Overview**: Total responses, completion rates, and statistics
- **Question Analysis**: Detailed breakdown for each question type
- **Visual Charts**: Progress bars and distribution charts
- **Data Export**: Download responses as CSV files
- **Real-time Updates**: See results as they come in

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS for utility-first styling
- **UI Components**: Radix UI for accessible, unstyled components
- **Form Handling**: React Hook Form with validation
- **Icons**: Lucide React for beautiful icons
- **Type Safety**: Full TypeScript coverage

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd survey-tool
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Navigation header
│   ├── SurveyBuilder.tsx   # Survey creation interface
│   ├── SurveyViewer.tsx    # Survey response interface
│   ├── SurveyResults.tsx   # Analytics and results
│   └── QuestionEditor.tsx  # Individual question editing
├── types/
│   └── survey.ts       # TypeScript type definitions
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles and Tailwind imports
```

## Usage Guide

### Creating a Survey

1. **Navigate to Builder**: The app opens in builder mode by default
2. **Set Survey Details**: Add a title and description for your survey
3. **Configure Settings**: 
   - Allow multiple responses
   - Show progress bar to respondents
   - Require email addresses
4. **Add Questions**: Click "Add Question" to create new questions
5. **Customize Questions**: 
   - Choose question type
   - Set title and description
   - Add options for multiple choice/checkbox
   - Configure rating scales
   - Mark questions as required
6. **Reorder Questions**: Use the up/down arrows to arrange questions
7. **Save Survey**: Click "Create Survey" to finalize

### Collecting Responses

1. **Switch to Preview**: Click the "Preview" tab in the header
2. **Share with Respondents**: The preview shows exactly what respondents will see
3. **Test the Flow**: Complete the survey yourself to test the experience
4. **Monitor Progress**: Use the progress bar (if enabled) to track completion

### Viewing Results

1. **Access Results**: Click the "Results" tab (available after creating a survey)
2. **Review Analytics**: 
   - Total response count
   - Completion rate
   - Question-by-question breakdown
3. **Analyze Responses**:
   - Rating averages
   - Multiple choice distributions
   - Recent text responses
4. **Export Data**: Click "Export CSV" to download all responses

## Customization

### Styling
The app uses Tailwind CSS with custom color schemes defined in `tailwind.config.js`:
- Primary colors (blue theme)
- Secondary colors (gray theme)
- Custom component classes in `index.css`

### Adding Question Types
To add new question types:
1. Update the `Question` type in `types/survey.ts`
2. Add the type to `QuestionEditor.tsx`
3. Implement rendering in `SurveyViewer.tsx`
4. Update analytics in `SurveyResults.tsx`

### UI Components
The app uses Radix UI primitives for accessibility. You can customize the appearance while maintaining accessibility features.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, please contact the AkquaintX team or create an issue in the repository.

---

**AkquaintX Survey Tool** - Empowering organizations to collect and analyze feedback efficiently.
