import { useState } from 'react';
import { Send } from 'lucide-react';
import ProjectCard from './ProjectCard';
import ProjectDetails from './ProjectDetails';
import type { Project } from './types';

const projects: Project[] = [
  {
    id: 'ai-chatbot',
    title: 'AI-Powered Customer Service Chatbot',
    description:
      'An intelligent chatbot system that handles customer inquiries using natural language processing and machine learning algorithms.',
    image:
      'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
    technologies: ['Python', 'TensorFlow', 'NLP', 'React'],
    features: [
      'Natural language understanding',
      'Multi-language support',
      'Integration with CRM systems',
      'Analytics dashboard',
    ],
    metrics: [
      { label: 'Response Accuracy', value: '95%' },
      { label: 'Query Resolution Time', value: '-60%' },
    ],
  },
  {
    id: 'data-analytics',
    title: 'E-commerce Analytics Dashboard',
    description:
      'A comprehensive analytics platform providing real-time insights into sales, customer behavior, and inventory management.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
    technologies: ['React', 'D3.js', 'Node.js', 'MongoDB'],
    features: [
      'Real-time data visualization',
      'Predictive analytics',
      'Custom reporting',
      'Mobile responsive design',
    ],
    metrics: [
      { label: 'Data Processing Speed', value: '+200%' },
      { label: 'User Engagement', value: '+85%' },
    ],
  },
  {
    id: 'mobile-app',
    title: 'Health & Fitness Tracking App',
    description:
      'A mobile application for tracking fitness activities, nutrition, and health metrics with social features.',
    image:
      'https://images.unsplash.com/photo-1539683255143-73a6b838b106?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
    technologies: ['React Native', 'Firebase', 'Node.js'],
    link: 'https://example.com',
  },
  {
    id: 'web-development',
    title: 'E-commerce Website Development',
    description:
      'A fully responsive, feature-rich e-commerce website that allows users to browse, purchase, and manage orders online.',
    image:
      'https://cdn.pixabay.com/photo/2021/11/22/20/20/online-6817350_1280.jpg',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
    features: [
      'User authentication and registration',
      'Real-time inventory management',
      'Integrated payment gateway',
      'Order tracking system',
    ],
    metrics: [
      { label: 'Conversion Rate', value: '+30%' },
      { label: 'Average Session Duration', value: '+50%' },
    ],
  },
  {
    id: 'ml-recommendation',
    title: 'Product Recommendation Engine',
    description:
      'An ML-powered system that provides personalized product recommendations based on user behavior and preferences.',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
    technologies: ['Python', 'scikit-learn', 'PostgreSQL'],
  },
];

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    requirements: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.requirements) {
      setStatus('Please fill in all required fields.');
      return;
    }

    try {
      const response = await fetch('https://cyberbind.in/api/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const result = await response.json();
        setStatus(result.message || 'Failed to send message.');
      } else {
        const result = await response.json();
        setStatus('Your message was sent successfully!');
        setFormData({ name: '', email: '', requirements: '' });
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      setStatus('Error: Could not send message. Please try again.');
    }
  };

  

  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Portfolio of Excellence
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our impactful projects across diverse domains. Each project showcases our
            commitment to innovation, quality, and delivering exceptional results.
          </p>
        </div>

        {/* Featured Projects */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {projects.slice(0, 2).map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              featured={true}
              onViewDetails={setSelectedProject}
            />
          ))}
        </div>

        {/* Regular Projects */}
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {projects.slice(2).map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onViewDetails={setSelectedProject}
            />
          ))}
        </div>

        {/* Contact Form */}
        <div id="contact-form" className="mt-20 max-w-2xl mx-auto">
          <div className="bg-sky-100 rounded-xl shadow-sm p-8">
            <h3 className="text-2xl font-bold text-center text-gray-900">
              Have a Project in Mind?
            </h3>
            <p className="mt-2 text-center text-gray-600">
              Let's build something amazing together. Tell us about your project!
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
                  Project Requirements
                </label>
                <textarea
                  name="requirements"
                  id="requirements"
                  rows={4}
                  value={formData.requirements}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </button>
            </form>
            {status && <p className="mt-4 text-center text-gray-700">{status}</p>}
          </div>
        </div>
      </div>

      <ProjectDetails
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
