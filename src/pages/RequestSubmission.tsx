
import MainLayout from "@/layouts/MainLayout";
import RequestForm from "@/components/RequestForm";
import { Calendar, Lock, Check } from "lucide-react";

const RequestSubmission = () => {
  return (
    <MainLayout>
      <section className="py-20 md:py-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-down">
              Request Automation
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up">
              Tell us about your process, and we'll evaluate how we can help automate
              it to save you time and resources.
            </p>
          </div>
          
          <div className="animate-fade-in">
            <RequestForm />
          </div>
          
          <div className="mt-16 max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-semibold mb-4">What Happens Next?</h3>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <li className="bg-white dark:bg-card p-6 rounded-xl subtle-border">
                <div className="flex items-center mb-3">
                  <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold mr-3">1</span>
                  <h4 className="font-semibold">Review</h4>
                </div>
                <p className="text-muted-foreground text-sm">
                  We'll review your request and assess if it's a good fit for automation.
                </p>
              </li>
              
              <li className="bg-white dark:bg-card p-6 rounded-xl subtle-border">
                <div className="flex items-center mb-3">
                  <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold mr-3">2</span>
                  <h4 className="font-semibold">Proposal</h4>
                </div>
                <p className="text-muted-foreground text-sm">
                  We'll reach out with questions and provide a detailed solution proposal.
                </p>
              </li>
              
              <li className="bg-white dark:bg-card p-6 rounded-xl subtle-border">
                <div className="flex items-center mb-3">
                  <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold mr-3">3</span>
                  <h4 className="font-semibold">Implementation</h4>
                </div>
                <p className="text-muted-foreground text-sm">
                  Once approved, we'll begin developing your custom automation solution.
                </p>
              </li>
            </ol>
          </div>
          
          <div className="mt-10 max-w-2xl mx-auto text-center p-6 bg-muted/20 rounded-xl subtle-border">
            <div className="flex justify-center mb-3">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Need to discuss your project first?</h4>
            <p className="text-muted-foreground">
              When submitting your request, select the option to schedule a consultation. 
              Our team will reach out to arrange a personalized meeting to understand your needs better.
            </p>
          </div>
          
          <div className="mt-10 max-w-2xl mx-auto text-center p-6 bg-muted/20 rounded-xl subtle-border">
            <div className="flex justify-center mb-3">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Secure Platform Access</h4>
            <p className="text-muted-foreground">
              Once your request is approved, you'll be able to securely submit access credentials for your platforms.
              All credentials are encrypted and only accessible to authorized team members working on your automation.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                <Check className="h-3 w-3 mr-1" /> End-to-end Encrypted
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                <Check className="h-3 w-3 mr-1" /> Secure Access Control
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                <Check className="h-3 w-3 mr-1" /> Compliant Storage
              </span>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default RequestSubmission;
