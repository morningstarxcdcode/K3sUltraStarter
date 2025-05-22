import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Upload, Files, BookOpen, ExternalLink } from 'lucide-react';

const features = [
  {
    title: 'Decentralized Storage',
    description: 'Store your files across the IPFS network, ensuring they remain accessible even if single nodes go offline.',
    icon: <Database className="h-12 w-12 text-primary-500" />,
  },
  {
    title: 'Content Addressing',
    description: 'Files are identified by their content, not location. This means identical files are only stored once across the network.',
    icon: <Files className="h-12 w-12 text-primary-500" />,
  },
  {
    title: 'Easy Sharing',
    description: 'Generate shareable links for your files that work globally, without any central server dependency.',
    icon: <ExternalLink className="h-12 w-12 text-primary-500" />,
  },
  {
    title: 'Educational Resources',
    description: 'Learn about IPFS concepts and how decentralized storage works through our interactive tutorials.',
    icon: <BookOpen className="h-12 w-12 text-primary-500" />,
  },
];

const Home: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Decentralized File Sharing with <span className="text-primary-500">IPFS</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Store and share your files on the InterPlanetary File System. 
            A peer-to-peer network for storing and sharing data in a distributed file system.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/upload"
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors shadow-sm flex items-center"
            >
              <Upload size={20} className="mr-2" />
              Upload Files
            </Link>
            <Link
              to="/learn"
              className="px-6 py-3 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-md transition-colors shadow-sm flex items-center"
            >
              <BookOpen size={20} className="mr-2" />
              Learn About IPFS
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Why Use IPFS for File Sharing?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-subtle hover:shadow-lg transition-shadow"
              >
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            How It Works
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-subtle p-6 md:p-8">
            <div className="flex flex-col space-y-8">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xl font-bold mb-4 md:mb-0 md:mr-6">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Upload Your File</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Drag and drop or select a file to upload. The file is processed and prepared for IPFS storage.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xl font-bold mb-4 md:mb-0 md:mr-6">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Content Addressing</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your file is cryptographically hashed to generate a unique Content Identifier (CID).
                    This CID is how your file will be addressed on the IPFS network.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xl font-bold mb-4 md:mb-0 md:mr-6">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Distribution</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your file is distributed across the IPFS network, making it available from multiple locations.
                    Anyone with the CID can access your file from the nearest available node.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xl font-bold mb-4 md:mb-0 md:mr-6">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Access & Share</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Use the CID to access your file directly through IPFS or via a public gateway.
                    Share the link with others for secure, decentralized file sharing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-500 dark:bg-primary-600 rounded-xl text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Try IPFS?</h2>
          <p className="text-xl mb-8 opacity-90">
            Experience the future of decentralized file sharing today.
          </p>
          <Link
            to="/upload"
            className="px-8 py-3 bg-white text-primary-600 hover:bg-gray-100 rounded-md transition-colors shadow-md inline-flex items-center"
          >
            <Upload size={20} className="mr-2" />
            Start Uploading
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;