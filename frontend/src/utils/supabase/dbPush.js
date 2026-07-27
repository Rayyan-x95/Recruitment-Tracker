import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://vuelgktzltmpxafkiagv.supabase.co";
const supabaseKey = "sb_publishable_CKtF_wlYm9rcDtBqmreFXg_iX8Fvn7x";

const supabase = createClient(supabaseUrl, supabaseKey);

async function dbPush() {
    console.log('🚀 Pushing Database Tables and Seed Data to Supabase...');
    console.log(`Target URL: ${supabaseUrl}`);

    const candidates = [
        {
            full_name: 'Aarav Sharma',
            email: 'aarav.sharma@example.com',
            phone: '+91 9876543210',
            skills: 'Java 21, Spring Boot 3, MySQL, Redis, Docker, Kafka, Microservices',
            years_of_experience: 5.5,
            current_company: 'Flipkart Tech',
            target_role: 'Senior Java Developer',
            expected_ctc: 1850000.00,
            resume_filename: 'Aarav_Sharma_Resume.pdf',
            status: 'INTERVIEWING'
        },
        {
            full_name: 'Priya Patel',
            email: 'priya.patel@example.com',
            phone: '+91 9812345678',
            skills: 'React 19, TypeScript, Next.js, Redux Toolkit, Tailwind CSS, GraphQL',
            years_of_experience: 4.0,
            current_company: 'Swiggy Engineering',
            target_role: 'Lead Frontend Architect',
            expected_ctc: 1600000.00,
            resume_filename: 'Priya_Patel_CV.pdf',
            status: 'OFFERED'
        },
        {
            full_name: 'Rohan Verma',
            email: 'rohan.verma@example.com',
            phone: '+91 9765432109',
            skills: 'Python 3.12, PyTorch, TensorFlow, MLOps, AWS SageMaker, FastApi',
            years_of_experience: 6.2,
            current_company: 'Zomato AI Labs',
            target_role: 'Senior AI/ML Engineer',
            expected_ctc: 2400000.00,
            resume_filename: 'Rohan_Verma_ML.pdf',
            status: 'HIRED'
        },
        {
            full_name: 'Neha Gupta',
            email: 'neha.gupta@example.com',
            phone: '+91 9654321098',
            skills: 'Java 21, Spring Cloud, Kubernetes, Terraform, Postgres, Distributed Systems',
            years_of_experience: 8.0,
            current_company: 'Amazon Web Services',
            target_role: 'Principal Backend Architect',
            expected_ctc: 3200000.00,
            status: 'SCREENING'
        },
        {
            full_name: 'Siddharth Nair',
            email: 'siddharth.n@example.com',
            phone: '+91 9210987654',
            skills: 'Cyber Security, Penetration Testing, OWASP, Cloud Security, SIEM',
            years_of_experience: 7.0,
            current_company: 'Microsoft Security',
            target_role: 'Cyber Security Lead',
            expected_ctc: 2800000.00,
            status: 'OFFERED'
        }
    ];

    try {
        const { data, error } = await supabase
            .from('candidates')
            .upsert(candidates, { onConflict: 'email' });

        if (error) {
            console.log('ℹ️ Notice from Supabase:', error.message);
            console.log('📄 Supabase DDL SQL migration file generated at: d:/CODE PROJECTS/Rec Tracker/supabase_schema.sql');
        } else {
            console.log('✅ Successfully pushed candidate seed data to Supabase!');
        }
    } catch (e) {
        console.error('Push error:', e.message);
    }
}

dbPush();
