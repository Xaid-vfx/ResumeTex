export const deedyTemplate = `
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Deedy Resume/CV
% XeLaTeX Template
% Version 1.0 (5/5/2014)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\documentclass[]{deedy-resume-openfont}
\\usepackage{fancyhdr}
\\pagestyle{fancy}
\\fancyhf{}

\\begin{document}

\\lastupdated

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%     TITLE NAME
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\namesection{ {{personalInfo.firstName}} }{ {{personalInfo.lastName}} }{
    \\urlstyle{same}\\href{ {{personalInfo.website}} }{ {{personalInfo.website}} } | 
    \\href{ {{personalInfo.facebook}} }{ {{personalInfo.facebook}} }\\\\
    \\href{mailto:{{personalInfo.email}}}{ {{personalInfo.email}} } | 
    {{personalInfo.phone}} | 
    \\href{mailto:{{personalInfo.alternateEmail}}}{ {{personalInfo.alternateEmail}} }
}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%     COLUMN ONE
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\begin{minipage}[t]{0.33\\textwidth} 

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%     EDUCATION
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\section{Education} 
{{#education}}
\\subsection{ {{institution}} }
\\descript{ {{degree}} }
\\location{ {{date}} | {{location}} }
{{#gpa}}\\location{Cum. GPA: {{gpa}} }{{/gpa}}
{{#majorGpa}}\\location{Major GPA: {{majorGpa}} }{{/majorGpa}}
{{#honors}}
{{#.}}{{.}}\\\\{{/.}}
{{/honors}}
\\sectionsep
{{/education}}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%     LINKS
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\section{Links} 
{{#links}}
{{#facebook}}Facebook:// \\href{ {{facebook}} }{\\bf {{facebook}} } \\\\{{/facebook}}
{{#github}}Github:// \\href{ {{github}} }{\\bf {{github}} } \\\\{{/github}}
{{#linkedin}}LinkedIn:// \\href{ {{linkedin}} }{\\bf {{linkedin}} } \\\\{{/linkedin}}
{{#youtube}}YouTube:// \\href{ {{youtube}} }{\\bf {{youtube}} } \\\\{{/youtube}}
{{#twitter}}Twitter:// \\href{ {{twitter}} }{\\bf {{twitter}} } \\\\{{/twitter}}
{{#quora}}Quora:// \\href{ {{quora}} }{\\bf {{quora}} }{{/quora}}
{{/links}}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%     COURSEWORK
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\section{Coursework}
\\subsection{Graduate}
{{#coursework.graduate}}
{{.}} \\\\
{{/coursework.graduate}}
\\sectionsep

\\subsection{Undergraduate}
{{#coursework.undergraduate}}
{{.}} \\\\
{{/coursework.undergraduate}}
\\sectionsep

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%     SKILLS
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\section{Skills}
\\subsection{Programming}
\\location{Over 5000 lines:}
{{#skills.overFiveThousand}}
{{.}}{{^last}} \\textbullet{} {{/last}}
{{/skills.overFiveThousand}}\\\\
\\location{Over 1000 lines:}
{{#skills.overThousand}}
{{.}}{{^last}} \\textbullet{} {{/last}}
{{/skills.overThousand}}\\\\
\\location{Familiar:}
{{#skills.familiar}}
{{.}}{{^last}} \\textbullet{} {{/last}}
{{/skills.familiar}}
\\sectionsep

\\end{minipage} 
\\hfill
\\begin{minipage}[t]{0.66\\textwidth} 

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%     EXPERIENCE
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\section{Experience}
{{#experience}}
\\runsubsection{ {{company}} }
\\descript{| {{role}} }
\\location{ {{date}} | {{location}} }
\\begin{tightemize}
{{#highlights}}
\\item {{.}}
{{/highlights}}
\\end{tightemize}
\\sectionsep
{{/experience}}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%     RESEARCH
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\section{Research}
{{#research}}
\\runsubsection{ {{institution}} }
\\descript{| {{role}} }
\\location{ {{date}} | {{location}} }
{{description}}
\\sectionsep
{{/research}}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%     AWARDS
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\section{Awards} 
\\begin{tabular}{rll}
{{#awards}}
{{year}} & {{rank}} & {{competition}} \\\\
{{/awards}}
\\end{tabular}
\\sectionsep

\\end{minipage} 
\\end{document}
`;

export default deedyTemplate; 