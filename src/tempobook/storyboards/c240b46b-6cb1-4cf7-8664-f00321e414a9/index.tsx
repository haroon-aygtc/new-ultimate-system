import ScrapingSystem from "@/components/admin/ScrapingSystem";
import Layout from "@/components/Layout";

export default function ScrapingSystemStoryboard() {
  return (
    <Layout showSidebar={true}>
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-brand-secondary">
            Web Scraping System
          </h1>
          <p className="text-brand-muted">
            Configure and run web scraping tasks
          </p>
        </div>
        <ScrapingSystem />
      </div>
    </Layout>
  );
}
