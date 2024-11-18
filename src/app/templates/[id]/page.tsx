import TemplateEditor from '../../../components/TemplateEditor';

export default function TemplatePage({ params }: { params: { id: string } }) {
    return <TemplateEditor templateId={params.id} />;
} 