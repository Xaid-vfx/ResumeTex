export const resumeTemplate = `
%-------------------------
% Resume in Latex
% Author : Jake Gutierrez
% Based off of: https://github.com/sb2nov/resume
% License : MIT
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape {{name}}} \\\\ \\vspace{1pt}
    \\small {{#phone}}{{phone}}{{/phone}}{{#phone}}{{#email}} $|$ {{/email}}{{/phone}}{{#email}}\\href{mailto:{{email}}}{\\underline{ {{email}} }}{{/email}}
    {{#linkedinUrl}}{{#hasContactInfo}} $|$ {{/hasContactInfo}}\\href{ {{linkedinUrl}} }{\\underline{ {{linkedinProfile}} }}{{/linkedinUrl}}
    {{#githubUrl}}{{#hasContactInfo}} $|$ {{/hasContactInfo}}\\href{ {{githubUrl}} }{\\underline{ {{githubProfile}} }}{{/githubUrl}}
\\end{center}

{{#hasEducation}}
%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
    {{#education}}
    \\resumeSubheading
      { {{school}} }{ {{location}} }
      { {{degree}} }{ {{date}} }
    {{/education}}
  \\resumeSubHeadingListEnd
{{/hasEducation}}

{{#hasExperience}}
%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
    {{#experience}}
    \\resumeSubheading
      { {{title}} }{ {{date}} }
      { {{company}} }{ {{location}} }
      {{#highlights.length}}
      \\resumeItemListStart
        {{#highlights}}
        \\resumeItem{ {{.}} }
        {{/highlights}}
      \\resumeItemListEnd
      {{/highlights.length}}
    {{/experience}}
  \\resumeSubHeadingListEnd
{{/hasExperience}}

{{#hasProjects}}
%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
      {{#projects}}
      \\resumeProjectHeading
          {\\textbf{ {{name}} } $|$ \\emph{ {{technologies}} }}{ {{date}} }
          {{#highlights.length}}
          \\resumeItemListStart
            {{#highlights}}
            \\resumeItem{ {{.}} }
            {{/highlights}}
          \\resumeItemListEnd
          {{/highlights.length}}
      {{/projects}}
    \\resumeSubHeadingListEnd
{{/hasProjects}}

{{#hasSkills}}
%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     {{#languages}}\\textbf{Languages}{: {{languages}} } \\\\{{/languages}}
     {{#frameworks}}\\textbf{Frameworks}{: {{frameworks}} } \\\\{{/frameworks}}
     {{#developerTools}}\\textbf{Developer Tools}{: {{developerTools}} } \\\\{{/developerTools}}
     {{#libraries}}\\textbf{Libraries}{: {{libraries}} }{{/libraries}}
    }}
 \\end{itemize}
{{/hasSkills}}

\\end{document}
`;

export default resumeTemplate; 