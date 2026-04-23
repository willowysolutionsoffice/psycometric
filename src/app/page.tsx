import GenericDashboard from '@/components/user-dashboard/generic-dashboard'

const HomePage = () => {
  return (
    <div>
      <GenericDashboard 
        title="Psychometric Assessment"
        subheading="Discover yourself and find out who you are, how you are, and what you can be with our psychometric assessments!"
        description="Our Psychometric and Career Assessment is based on globally reliable and validated career test theories on Interest, Aptitude, Personality, and Multiple Intelligences. These assessments are further fine-tuned to meet the global standards by a panel of career counsellors, psychologists, and research team (aka the really smart people). So relax and trust us with your future."
        imageSrc="/images/dashboard-img.png"
      />
    </div>
  );
};

export default HomePage;