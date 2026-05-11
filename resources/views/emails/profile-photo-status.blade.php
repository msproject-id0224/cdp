@component('mail::message')
# Profile Photo Status Update

Hello {{ $user->name }},

Your profile photo request has been **{{ str_replace('_', ' ', $status) }}**.

@if($status === 'approved')
Your new profile photo is now active.
@elseif($status === 'rejected')
Reason: {{ $reason }}

Please upload a new photo that follows our guidelines.
@elseif($status === 'reupload_requested')
Reason: {{ $reason }}

Please upload a new photo as requested by the administrator.
@endif

Thanks,<br>
{{ config('app.name') }}
@endcomponent
