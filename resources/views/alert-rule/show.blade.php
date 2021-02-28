@extends('layouts.app')

@section('page-title') {{ __('beep.AlertRule').': '.(isset($alertrule->name) ? $alertrule->name : __('general.Item')).' ('.$alertrule->id.')' }}
@endsection

@section('content')
    @component('components/box')
        @slot('title')
            {{ (isset($alertrule->name) ? $alertrule->name : __('general.Item')).' '.__('crud.attributes') }}
        @endslot

        @slot('action')
            @permission('role-edit')
                <a href="{{ route('alert-rule.edit', $alertrule->id) }}" title="{{ __('crud.edit') }}"><button class="btn btn-primary"><i class="fa fa-pencil" aria-hidden="true"></i></button></a>
            @endpermission
        @endslot

        @slot('body')

            <table class="table table-responsive table-striped">
                <tbody>
                    <tr>
                        <th>ID</th><td>{{ $alertrule->id }}</td>
                    </tr>
                    <tr><th> Name </th><td> {{ $alertrule->name }} </td></tr><tr><th> Description </th><td> {{ $alertrule->description }} </td></tr><tr><th> Measurement Id </th><td> {{ $alertrule->measurement_id }} </td></tr><tr><th> Calculation </th><td> {{ $alertrule->calculation }} </td></tr><tr><th> Calculation Minutes </th><td> {{ $alertrule->calculation_minutes }} </td></tr><tr><th> Comparator </th><td> {{ $alertrule->comparator }} </td></tr><tr><th> Comparison </th><td> {{ $alertrule->comparison }} </td></tr><tr><th> Threshold Value </th><td> {{ $alertrule->threshold_value }} </td></tr>
                </tbody>
            </table>

        @endslot
    @endcomponent
@endsection
