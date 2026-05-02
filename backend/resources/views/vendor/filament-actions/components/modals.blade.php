@if ($this instanceof \Filament\Actions\Contracts\HasActions && (! $this->hasActionsModalRendered))
    @php
        $action = $this->getMountedAction();
    @endphp

    @if ($action)
        <form wire:submit.prevent="callMountedAction">
            <x-filament::modal
                :alignment="$action->getModalAlignment()"
                :close-button="$action->hasModalCloseButton()"
                :close-by-clicking-away="$action->isModalClosedByClickingAway()"
                :description="$action->getModalDescription()"
                display-classes="block"
                :footer-actions="$action->getVisibleModalFooterActions()"
                :footer-actions-alignment="$action->getModalFooterActionsAlignment()"
                :heading="$action->getModalHeading()"
                :icon="$action->getModalIcon()"
                :icon-color="$action->getModalIconColor()"
                :id="$this->getId() . '-action'"
                :slide-over="$action->isModalSlideOver()"
                :sticky-footer="$action->isModalFooterSticky()"
                :sticky-header="$action->isModalHeaderSticky()"
                :visible="true"
                :width="$action->getModalWidth()"
                :wire:key="$this->getId() . '.actions.' . $action->getName() . '.modal'"
                x-on:closed-form-component-action-modal.window="if (($event.detail.id === '{{ $this->getId() }}') && $wire.mountedActions.length) open()"
                x-on:modal-closed.stop="
                    const mountedActionShouldOpenModal = {{ \Illuminate\Support\Js::from($this->mountedActionShouldOpenModal()) }}

                    if (! mountedActionShouldOpenModal) {
                        return
                    }

                    if ($wire.mountedFormComponentActions.length) {
                        return
                    }

                    $wire.unmountAction(false)
                "
                x-on:opened-form-component-action-modal.window="if ($event.detail.id === '{{ $this->getId() }}') close()"
            >
                {{ $action->getModalContent() }}

                @if (count(($infolist = $action->getInfolist())?->getComponents() ?? []))
                    {{ $infolist }}
                @elseif ($this->mountedActionHasForm())
                    {{ $this->getMountedActionForm() }}
                @endif

                {{ $action->getModalContentFooter() }}
            </x-filament::modal>
        </form>

        @php
            $this->hasActionsModalRendered = true;
        @endphp
    @endif
@endif

@if ($this instanceof \Filament\Tables\Contracts\HasTable && (! $this->hasTableModalRendered))
    @php
        $tableAction = $this->getMountedTableAction();
        $tableBulkAction = $this->getMountedTableBulkAction();
    @endphp

    @if ($tableAction)
        <form wire:submit.prevent="callMountedTableAction">
            <x-filament::modal
                :alignment="$tableAction->getModalAlignment()"
                :close-button="$tableAction->hasModalCloseButton()"
                :close-by-clicking-away="$tableAction->isModalClosedByClickingAway()"
                :description="$tableAction->getModalDescription()"
                display-classes="block"
                :footer-actions="$tableAction->getVisibleModalFooterActions()"
                :footer-actions-alignment="$tableAction->getModalFooterActionsAlignment()"
                :heading="$tableAction->getModalHeading()"
                :icon="$tableAction->getModalIcon()"
                :icon-color="$tableAction->getModalIconColor()"
                :id="$this->getId() . '-table-action'"
                :slide-over="$tableAction->isModalSlideOver()"
                :sticky-footer="$tableAction->isModalFooterSticky()"
                :sticky-header="$tableAction->isModalHeaderSticky()"
                :visible="true"
                :width="$tableAction->getModalWidth()"
                :wire:key="$this->getId() . '.table.actions.' . $tableAction->getName() . '.modal'"
                x-on:closed-form-component-action-modal.window="if (($event.detail.id === '{{ $this->getId() }}') && $wire.mountedTableActions.length) open()"
                x-on:modal-closed.stop="
                    const mountedTableActionShouldOpenModal = {{ \Illuminate\Support\Js::from($this->mountedTableActionShouldOpenModal()) }}

                    if (! mountedTableActionShouldOpenModal) {
                        return
                    }

                    if ($wire.mountedFormComponentActions.length) {
                        return
                    }

                    $wire.unmountTableAction(false)
                "
                x-on:opened-form-component-action-modal.window="if ($event.detail.id === '{{ $this->getId() }}') close()"
            >
                {{ $tableAction->getModalContent() }}

                @if (count(($infolist = $tableAction->getInfolist())?->getComponents() ?? []))
                    {{ $infolist }}
                @elseif ($this->mountedTableActionHasForm())
                    {{ $this->getMountedTableActionForm() }}
                @endif

                {{ $tableAction->getModalContentFooter() }}
            </x-filament::modal>
        </form>
    @endif

    @if ($tableBulkAction)
        <form wire:submit.prevent="callMountedTableBulkAction">
            <x-filament::modal
                :alignment="$tableBulkAction->getModalAlignment()"
                :close-button="$tableBulkAction->hasModalCloseButton()"
                :close-by-clicking-away="$tableBulkAction->isModalClosedByClickingAway()"
                :description="$tableBulkAction->getModalDescription()"
                display-classes="block"
                :footer-actions="$tableBulkAction->getVisibleModalFooterActions()"
                :footer-actions-alignment="$tableBulkAction->getModalFooterActionsAlignment()"
                :heading="$tableBulkAction->getModalHeading()"
                :icon="$tableBulkAction->getModalIcon()"
                :icon-color="$tableBulkAction->getModalIconColor()"
                :id="$this->getId() . '-table-bulk-action'"
                :slide-over="$tableBulkAction->isModalSlideOver()"
                :sticky-footer="$tableBulkAction->isModalFooterSticky()"
                :sticky-header="$tableBulkAction->isModalHeaderSticky()"
                :visible="true"
                :width="$tableBulkAction->getModalWidth()"
                :wire:key="$this->getId() . '.table.bulk-actions.' . $tableBulkAction->getName() . '.modal'"
                x-on:closed-form-component-action-modal.window="if (($event.detail.id === '{{ $this->getId() }}') && $wire.mountedTableBulkAction) open()"
                x-on:modal-closed.stop="
                    const mountedTableBulkActionShouldOpenModal = {{ \Illuminate\Support\Js::from($this->mountedTableBulkActionShouldOpenModal()) }}

                    if (! mountedTableBulkActionShouldOpenModal) {
                        return
                    }

                    if ($wire.mountedFormComponentActions.length) {
                        return
                    }

                    $wire.unmountTableBulkAction(false)
                "
                x-on:opened-form-component-action-modal.window="if ($event.detail.id === '{{ $this->getId() }}') close()"
            >
                {{ $tableBulkAction->getModalContent() }}

                @if (count(($infolist = $tableBulkAction->getInfolist())?->getComponents() ?? []))
                    {{ $infolist }}
                @elseif ($this->mountedTableBulkActionHasForm())
                    {{ $this->getMountedTableBulkActionForm() }}
                @endif

                {{ $tableBulkAction->getModalContentFooter() }}
            </x-filament::modal>
        </form>
    @endif

    @if ($tableAction || $tableBulkAction)
        @php
            $this->hasTableModalRendered = true;
        @endphp
    @endif
@endif

@if ($this instanceof \Filament\Infolists\Contracts\HasInfolists && (! $this->hasInfolistsModalRendered))
    @php
        $infolistAction = $this->getMountedInfolistAction();
    @endphp

    @if ($infolistAction)
        <form wire:submit.prevent="callMountedInfolistAction">
            <x-filament::modal
                :alignment="$infolistAction->getModalAlignment()"
                :close-button="$infolistAction->hasModalCloseButton()"
                :close-by-clicking-away="$infolistAction->isModalClosedByClickingAway()"
                :description="$infolistAction->getModalDescription()"
                display-classes="block"
                :footer-actions="$infolistAction->getVisibleModalFooterActions()"
                :footer-actions-alignment="$infolistAction->getModalFooterActionsAlignment()"
                :heading="$infolistAction->getModalHeading()"
                :icon="$infolistAction->getModalIcon()"
                :icon-color="$infolistAction->getModalIconColor()"
                :id="$this->getId() . '-infolist-action'"
                :slide-over="$infolistAction->isModalSlideOver()"
                :sticky-footer="$infolistAction->isModalFooterSticky()"
                :sticky-header="$infolistAction->isModalHeaderSticky()"
                :visible="true"
                :width="$infolistAction->getModalWidth()"
                :wire:key="$this->getId() . '.infolist.actions.' . $infolistAction->getName() . '.modal'"
                x-on:closed-form-component-action-modal.window="if (($event.detail.id === '{{ $this->getId() }}') && $wire.mountedInfolistActions.length) open()"
                x-on:modal-closed.stop="
                    const mountedInfolistActionShouldOpenModal = {{ \Illuminate\Support\Js::from($this->mountedInfolistActionShouldOpenModal()) }}

                    if (! mountedInfolistActionShouldOpenModal) {
                        return
                    }

                    if ($wire.mountedFormComponentActions.length) {
                        return
                    }

                    $wire.unmountInfolistAction(false)
                "
                x-on:opened-form-component-action-modal.window="if ($event.detail.id === '{{ $this->getId() }}') close()"
            >
                {{ $infolistAction->getModalContent() }}

                @if (count(($infolist = $infolistAction->getInfolist())?->getComponents() ?? []))
                    {{ $infolist }}
                @elseif ($this->mountedInfolistActionHasForm())
                    {{ $this->getMountedInfolistActionForm() }}
                @endif

                {{ $infolistAction->getModalContentFooter() }}
            </x-filament::modal>
        </form>

        @php
            $this->hasInfolistsModalRendered = true;
        @endphp
    @endif
@endif

@if ((! $this->hasFormsModalRendered) && method_exists($this, 'getMountedFormComponentAction'))
    @php
        $formComponentAction = $this->getMountedFormComponentAction();
    @endphp

    @if ($formComponentAction)
        <form wire:submit.prevent="callMountedFormComponentAction">
            <x-filament::modal
                :alignment="$formComponentAction->getModalAlignment()"
                :close-button="$formComponentAction->hasModalCloseButton()"
                :close-by-clicking-away="$formComponentAction->isModalClosedByClickingAway()"
                :description="$formComponentAction->getModalDescription()"
                display-classes="block"
                :footer-actions="$formComponentAction->getVisibleModalFooterActions()"
                :footer-actions-alignment="$formComponentAction->getModalFooterActionsAlignment()"
                :heading="$formComponentAction->getModalHeading()"
                :icon="$formComponentAction->getModalIcon()"
                :icon-color="$formComponentAction->getModalIconColor()"
                :id="$this->getId() . '-form-component-action'"
                :slide-over="$formComponentAction->isModalSlideOver()"
                :sticky-footer="$formComponentAction->isModalFooterSticky()"
                :sticky-header="$formComponentAction->isModalHeaderSticky()"
                :visible="true"
                :width="$formComponentAction->getModalWidth()"
                :wire:key="$this->getId() . '.' . $formComponentAction->getComponent()->getStatePath() . '.actions.' . $formComponentAction->getName() . '.modal'"
                x-on:modal-closed.stop="
                    const mountedFormComponentActionShouldOpenModal = {{ \Illuminate\Support\Js::from($this->mountedFormComponentActionShouldOpenModal()) }}

                    if (mountedFormComponentActionShouldOpenModal) {
                        $wire.unmountFormComponentAction(false)
                    }
                "
            >
                {{ $formComponentAction->getModalContent() }}

                @if (count(($infolist = $formComponentAction->getInfolist())?->getComponents() ?? []))
                    {{ $infolist }}
                @elseif ($this->mountedFormComponentActionHasForm())
                    {{ $this->getMountedFormComponentActionForm() }}
                @endif

                {{ $formComponentAction->getModalContentFooter() }}
            </x-filament::modal>
        </form>

        @php
            $this->hasFormsModalRendered = true;
        @endphp
    @endif
@endif
