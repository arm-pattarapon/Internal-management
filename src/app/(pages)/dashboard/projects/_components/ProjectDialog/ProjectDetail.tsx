import React, { useState } from 'react'
import { Project, Status } from '../../type'
import { DialogTitle} from "@headlessui/react";
import clsx from 'clsx';

interface props {
  project: Project;
  status: Status[];
}

function ProjectDetail({ project, status }: props) {
  const [isShowDetail, setIsShowDetail] = useState(false);
  const descriptionOverflow = project.description.length >= 200;

  function toggleDetail() {
    setIsShowDetail(prev => !prev)
  }

  return (
    <div>
      <DialogTitle as="h3" className="text-base/7 font-medium text-black">
      <div>{project.name}<span className='text-black/50 text-xs align-middle'> {status.find(s => s._id === project.statusId)?.title || ''}</span></div>
        <div className='text-black/80 text-xs'>{project.type}</div>
      </DialogTitle>
      <p className={clsx("mt-2 text-sm/6 text-black/50")}>
        {isShowDetail || !descriptionOverflow
          ? project.description
          : `${project.description.substring(0, 200)} . . .`}
      </p>
      {descriptionOverflow && (
        <span onClick={toggleDetail} className='cursor-pointer select-none text-blue-500 text-sm'>
          {isShowDetail ? 'Show less' : 'Show more'}
        </span>
      )}
      <div className='grid grid-cols-3 mt-3 justify-center'>
        <div className='flex flex-col space-y-1 items-center'>
          <div className='text-sm'>Project Lead</div>
          <div className="w-10 h-10 cursor-pointer overflow-hidden border-white border-1 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
            <img className="object-cover select-none" src="/default_user_logo.png" alt="user_logo" />
          </div>
          <div className='text-xs'>{project.projectManager.name}</div>
        </div>
        <div className='flex flex-col space-y-1 items-center'>
          <div className='text-sm'>Business Analyst Lead</div>
          <div className="w-10 h-10 cursor-pointer overflow-hidden border-white border-1 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
            <img className="object-cover select-none" src="/default_user_logo.png" alt="user_logo" />
          </div>
          <div className='text-xs'>{project.businessanalystLead.name}</div>
        </div>
        <div className='flex flex-col space-y-1 items-center'>
          <div className='text-sm'>Developer Lead</div>
          <div className="w-10 h-10 cursor-pointer overflow-hidden border-white border-1 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
            <img className="object-cover select-none" src="/default_user_logo.png" alt="user_logo" />
          </div>
          <div className='text-xs'>{project.developerLead.name}</div>
        </div>
      </div>
      <p className='text-sm text-center my-3'>Member</p>
      <div className='flex flex-wrap justify-around space-x-3 space-y-2'>
        {project.users.map((user, index) => (
          <div key={index} className='flex flex-col space-y-1 items-center'>
            <div className="w-10 h-10 cursor-pointer overflow-hidden border-white border-1 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
              <img className="object-cover select-none" src="/default_user_logo.png" alt="user_logo" />
            </div>
            <div className='text-xs'>{user.name}</div>
            <div className='text-xs text-black/50'>({user.role})</div>
          </div>
        ))}

      </div>
      <div className='flex justify-evenly mt-3'>
        <div className='flex flex-col items-center'>
          <div className='text-xs'>Start Date</div>
          <div className='text-xs text-black/50'>
            {
              project.startDate
                ? new Date(project.startDate).toLocaleDateString('th-TH')
                : '-'
            }
          </div>
        </div>
        <div className='flex flex-col items-center'>
          <div className='text-xs'>Due Date</div>
          <div className='text-xs text-black/50'>
            {
              project.dueDate
                ? new Date(project.dueDate).toLocaleDateString('th-TH')
                : '-'
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail
