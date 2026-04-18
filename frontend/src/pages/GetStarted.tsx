import { Stethoscope, Building2, User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GetStarted = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'doctor',
      title: 'Doctor',
      description: 'Join the platform as a medical professional.',
      icon: <Stethoscope className="w-12 h-12 text-primary" />,
      path: '/doctor/login'
    },
    {
      id: 'clinic',
      title: 'Clinic',
      description: 'Manage your clinic, doctors, and patients.',
      icon: <Building2 className="w-12 h-12 text-primary" />,
      path: '/clinic/login',
      highlighted: true
    },
    {
      id: 'patient',
      title: 'Patient',
      description: 'Book consultations and manage your health.',
      icon: <User className="w-12 h-12 text-primary" />,
      path: '/patient/login'
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 sm:p-10">
      {/* Back link */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 flex items-center gap-2 text-sm text-[#999] hover:text-[#1A1A1A] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-[36px] font-normal text-[#1A1A1A] mb-2 tracking-tight">Join <span className="text-primary font-bold">Clyra</span></h1>
        <p className="text-[15px] text-[#999]">Choose your journey to getting started.</p>
      </div>

      {/* Cards Grid */}
      <div className="flex flex-col md:flex-row gap-6 max-w-[800px] w-full items-center justify-center">
        {roles.map((role) => (
          <div
            key={role.id}
            onClick={() => {
              // Scale down animation and then navigate
              navigate(role.path);
            }}
            className={`
              relative flex flex-col items-center text-center p-9 w-full md:w-[220px] rounded-[20px] 
              border-[1.5px] border-[#EEEEEE] bg-white cursor-pointer group 
              hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] hover:-translate-y-1 hover:border-primary
              active:scale-[0.97] transition-all duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)]
              ${role.highlighted ? 'border-t-[3px] border-t-accent' : ''}
            `}
          >
            <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
              {role.icon}
            </div>
            <h3 className="text-[18px] font-semibold text-[#1A1A1A] mb-2">{role.title}</h3>
            <p className="text-[14px] text-[#999] leading-relaxed">
              {role.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetStarted;
