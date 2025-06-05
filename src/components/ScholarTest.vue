<template>
  <div class="q-pa-md">
    <div class="col-xs-12 col-sm-6">
      <div class="q-col-gutter-md row items-start">
        <div class="col-xs-12 col-sm-12 col-md-6">
          <q-card class="my-card text-black rounded-borders-20 q-mr-md cards" flat>
            <q-card-section>
              <div class="text-h6 text-primary">View Scholars</div>
              <div class="text-subtitle2 text-primary">Scholars Table</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-card flat>
                <q-tabs
                  v-model="tab"
                  dense
                  class="text-grey cards"
                  active-color="primary"
                  indicator-color="primary"
                  align="left"
                  narrow-indicator
                >
                  <q-tab name="oscholars" label="Ongoing" />
                  <q-tab name="gradscholars" label="Graduated" />

                  <q-tab name="termscholars" label="Terminated" />
                </q-tabs>

                <!-- Ongoing Scholars -->

                <q-tab-panels v-model="tab" animated class="cards">
                  <q-tab-panel name="oscholars">
                    <ScholarsTbl
                      :rows="onrows"
                      :columns="columns"
                      :showfile="handleFiles"
                      @row-click="handleRowClick"
                    />
                  </q-tab-panel>

                  <!-- Graduate Scholars -->

                  <q-tab-panel name="gradscholars">
                    <ScholarsTbl
                      :rows="gradrows"
                      :columns="columns"
                      :showfile="handleFiles"
                      @row-click="handleRowClick"
                    />
                  </q-tab-panel>

                  <!-- Terimnated Scholars -->

                  <q-tab-panel name="termscholars">
                    <ScholarsTbl
                      :rows="termrows"
                      :columns="columns"
                      :showfile="handleFiles"
                      @row-click="handleRowClick"
                    />
                  </q-tab-panel>
                </q-tab-panels>
              </q-card>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
          <q-card class="my-card rounded-borders-20 cards" flat>
            <form id="submitScholarForm" @submit.prevent.stop="submitScholar">
              <div class="q-pa-md">
                <div class="row items-center q-col-gutter-md q-mb-md">
                  <!-- Left Column: Title -->
                  <div class="col-12 col-md">
                    <div class="text-h6 text-bold row items-center">
                      <IconUser class="text-negative q-mr-sm" :size="40" stroke-width="2" />
                      <span
                        :class="['text-h6 text-bold', isEditing ? 'text-warning' : 'text-primary']"
                      >
                        {{
                          isEditing
                            ? 'EDIT Scholarship Information Details'
                            : 'NEW Scholarship Information Details'
                        }}
                      </span>
                    </div>
                  </div>

                  <!-- Right Column: Buttons -->
                  <div class="col-12 col-md-auto">
                    <div class="row justify-end q-gutter-sm">
                      <BaseBtn
                        btnlabel="Batch Upload"
                        @click="docxUpload = true"
                        icon="cloud_upload"
                        flat
                        v-if="!isEditing"
                      />
                      <BaseBtn
                        btnlabel="New Scholar"
                        @click="newScholar"
                        icon="school"
                        flat
                        v-if="isEditing"
                      />
                      <BaseBtn
                        btnlabel="Print"
                        @click="generatePDF"
                        icon="print"
                        flat
                        v-if="isEditing"
                      />
                      <BaseBtn
                        :btnlabel="isEditing ? 'Save Changes' : 'Submit New Scholar'"
                        type="submit"
                        flat
                      />
                    </div>
                  </div>
                </div>

                <q-separator />

                <q-card-section>
                  <q-scroll-area style="height: 840px; width: 100%">
                    <div class="col-12">
                      <div class="q-col-gutter-md row items-start">
                        <div class="col-xs-12 col-sm-3 col-md-3">
                          <BaseInputRead
                            title="SPAS Level"
                            name="spas_level"
                            v-model="level"
                            v-if="isEditing == false"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-3 col-md-3">
                          <BaseInputRead
                            title="Current Year"
                            name="currentYear"
                            v-model="currentYear"
                            v-if="isEditing == false"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-3 col-md-3">
                          <BaseInputRead
                            title="SPAS Region"
                            name="spas_region"
                            v-model="state.region"
                            v-if="isEditing == false"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-3 col-md-3">
                          <BaseInputRead
                            title="SPAS Academic Year"
                            name="spas_academic_year"
                            v-model="spas_academic_year"
                            v-if="isEditing == false"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-4 col-md-4" v-if="isEditing">
                          <BaseInputRead title="SPAS ID" name="spasid" v-model="state.spasid" />
                        </div>
                        <div class="col-xs-12 col-sm-4 col-sm-4" v-if="isEditing">
                          <BaseSelect
                            ref="refStatus"
                            title="Status"
                            name="status"
                            v-model="status"
                            :options="statusOptions"
                            :filter-fn="filterStatus"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-4 col-md-4" v-if="isEditing">
                          <BaseSelect
                            ref="refSubStatus"
                            title="Sub Status"
                            name="substatus"
                            v-model="substatus"
                            :options="substatusOptions"
                            :filter-fn="filterSubStatus"
                            :rules="[isSelected]"
                          />
                        </div>

                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            title="First Name"
                            ref="reffirstname"
                            name="firstname"
                            v-model="state.firstname"
                            :rules="[requiredField]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            title="Middle Name"
                            name="middlename"
                            v-model="state.middlename"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            title="Last Name"
                            ref="reflastname"
                            name="lastname"
                            v-model="state.lastname"
                            :rules="[requiredField]"
                          />
                        </div>

                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            title="Suffix Name"
                            name="suffixname"
                            v-model="state.suffixname"
                          />
                        </div>

                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            title="Birthday"
                            ref="refbirth"
                            name="birth"
                            v-model="state.birth"
                            :rules="[requiredField]"
                            type="date"
                          />
                        </div>

                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <div class="row justify-start">
                            <BaseBasicSelect
                              ref="refsex"
                              name="sex"
                              title="Sex"
                              :options="sexOptions"
                              v-model="sex"
                              :rules="[requiredField]"
                            />
                          </div>
                        </div>

                        <div class="col-xs-12 col-sm-6 col-md-12">
                          <div class="text-h6 text-bold q-mb-md row items-center">
                            <IconAddressBook
                              class="text-negative q-mr-sm"
                              :size="40"
                              stroke-width="2"
                            />
                            <span class="text-h6 text-bold text-primary">Contact Information</span>
                          </div>
                          <q-separator />
                          <br />
                        </div>

                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            title="E-mail"
                            ref="refemail"
                            name="email"
                            v-model="state.email"
                            :rules="[requiredField]"
                            placeholder="Please make sure that your e-mail is valid"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            title="Alternate E-mail"
                            ref="refalemail"
                            name="alemail"
                            v-model="state.alemail"
                            :rules="[requiredField]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            title="Contact"
                            ref="refcontact"
                            name="contact"
                            v-model="state.contact"
                            mask="(####) ###-####"
                            placeholder="(09##) ###-####"
                            type="tel"
                            :rules="[requiredField]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-12">
                          <UpdateSelect
                            ref="refzipcode"
                            title="Zip Code"
                            name="zipcode"
                            v-model="zipcode"
                            :options="zipcodeOptions"
                            :onFilter="filterZipcode"
                            @update:modelValue="populateAddress"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            ref="refblocklot"
                            title="Block/Lot/House No."
                            name="blocklot"
                            v-model="state.blocklot"
                            :rules="[requiredField]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            ref="refstreet"
                            title="Compound/Street/Phase/Purok"
                            name="street"
                            v-model="state.street"
                            :rules="[requiredField]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            title="Subdivision/Village"
                            name="subdivision"
                            v-model="state.subdivision"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput title="Barangay" name="barangay" v-model="state.barangay" />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInputRead
                            title="District"
                            name="district"
                            v-model="state.district"
                            readonly
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInputRead title="Region" name="region" v-model="state.region" />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInputRead
                            title="Municipality/City"
                            name="municipality"
                            v-model="state.municipality"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-12">
                          <BaseInputRead
                            title="Province"
                            name="province"
                            v-model="state.province"
                          />
                        </div>
                        <br />
                        <div class="col-xs-12 col-sm-6 col-md-12">
                          <div class="text-h6 text-bold q-mb-md row items-center">
                            <IconBuilding
                              class="text-negative q-mr-sm"
                              :size="40"
                              stroke-width="2"
                            />
                            <span class="text-h6 text-bold text-primary"
                              >Previous School Informations</span
                            >
                          </div>
                          <q-separator />
                          <br />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseSelect
                            ref="refPrevCourse"
                            title="Previous Course"
                            name="prevCourse"
                            v-model="prevCourse"
                            :options="prevCourseOptions"
                            :filter-fn="filterPrevCourse"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseSelect
                            ref="refPrevSchool"
                            title="Previous School"
                            name="prevschool"
                            v-model="prevschool"
                            :options="prevSchoolOptions"
                            :filter-fn="filterPrevSchool"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseSelect
                            ref="refScProg"
                            title="Scholarship Program"
                            name="scprog"
                            v-model="scprog"
                            :options="ScProgramOptions"
                            :filter-fn="filterScProgram"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            title="Units"
                            ref="refunits"
                            name="units"
                            v-model="state.units"
                            :rules="[requiredField]"
                            type="number"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-12">
                          <div class="text-h6 text-bold q-mb-md row items-center">
                            <IconSchool class="text-negative q-mr-sm" :size="40" stroke-width="2" />
                            <span class="text-h6 text-bold text-primary">Graduate School</span>
                          </div>
                          <q-separator />
                          <br />
                        </div>
                        <div class="col-xs-12">
                          <BaseSelect
                            ref="refcouncil"
                            title="Monitoring Council/ University"
                            name="council"
                            v-model="council"
                            :options="councilOptions"
                            :filter-fn="filterCouncil"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <UpdateSelect
                            ref="refgradschool"
                            title="Graduate School"
                            name="gradschool"
                            v-model="gradschool"
                            :options="gradschoolOptions"
                            :onFilter="filterGradschool"
                            @update:modelValue="populateschool"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInputRead
                            title="School Region"
                            name="schoolregion"
                            v-model="state.schoolregion"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <UpdateSelect
                            ref="refgradcourse"
                            title="Graduate Course"
                            name="gradcourse"
                            v-model="gradcourse"
                            :options="gradcourseOptions"
                            :onFilter="filterGradcourse"
                            @update:modelValue="populateCourseField"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInputRead title="Field" name="fields" v-model="state.fields" />
                        </div>
                        <div class="col-xs-12">
                          <BaseInput
                            title="Duration"
                            ref="refduration"
                            name="duration"
                            v-model="state.duration"
                            :rules="[requiredField]"
                          />
                        </div>
                        <div class="col-xs-12">
                          <q-list bordered class="rounded-borders">
                            <q-expansion-item
                              expand-separator
                              icon="school"
                              label="Foreign"
                              caption="Scholar"
                            >
                              <q-card>
                                <q-card-section>
                                  <div class="col-xs-12 col-sm-6">
                                    <div class="q-col-gutter-md row items-start">
                                      <div class="col-xs-12 col-sm-1 col-md-1">
                                        <BaseInput
                                          title="Sem"
                                          ref="refForeignsemone"
                                          name="foreignsemone"
                                          v-model="state.foreignsemone"
                                          :rules="[requiredField]"
                                          type="number"
                                        />
                                      </div>
                                      <div class="col-xs-12 col-sm-5 col-md-5">
                                        <BaseInput
                                          title="Start Date"
                                          ref="refForeignstartdate"
                                          name="foreignstartdate"
                                          v-model="state.foreignstartdate"
                                          :rules="[requiredField]"
                                          type="date"
                                        />
                                      </div>
                                      <div class="col-xs-12 col-sm-1 col-md-1">
                                        <BaseInput
                                          title="Sem"
                                          ref="refForeignsemtwo"
                                          name="foreignsemtwo"
                                          v-model="state.foreignsemtwo"
                                          :rules="[requiredField]"
                                          type="number"
                                        />
                                      </div>
                                      <div class="col-xs-12 col-sm-5 col-md-5">
                                        <BaseInput
                                          title="Date Expected to Graduate"
                                          ref="refForeignenddate"
                                          name="foreignenddate"
                                          v-model="state.foreignenddate"
                                          :rules="[requiredField]"
                                          type="date"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </q-card-section>
                              </q-card>
                            </q-expansion-item>

                            <q-expansion-item
                              expand-separator
                              icon="school"
                              label="Local"
                              caption="Scholar"
                            >
                              <q-card>
                                <q-card-section>
                                  <div class="col-xs-12 col-sm-6">
                                    <div class="q-col-gutter-md row items-start">
                                      <div class="col-xs-12 col-sm-1 col-md-1">
                                        <BaseInput
                                          title="Sem"
                                          ref="refLocalsemone"
                                          name="localsemone"
                                          v-model="state.localsemone"
                                          :rules="[requiredField]"
                                          type="number"
                                        />
                                      </div>
                                      <div class="col-xs-12 col-sm-5 col-md-5">
                                        <BaseInput
                                          title="Start Date"
                                          ref="refLocalstartdate"
                                          name="localstartdate"
                                          v-model="state.localstartdate"
                                          :rules="[requiredField]"
                                          type="date"
                                        />
                                      </div>
                                      <div class="col-xs-12 col-sm-1 col-md-1">
                                        <BaseInput
                                          title="Sem"
                                          ref="refLocalsemtwo"
                                          name="localsemtwo"
                                          v-model="state.localsemtwo"
                                          :rules="[requiredField]"
                                          type="number"
                                        />
                                      </div>

                                      <div class="col-xs-12 col-sm-5 col-md-5">
                                        <BaseInput
                                          title="Date Expected to Graduate"
                                          ref="refLocalEnddate"
                                          name="localenddate"
                                          v-model="state.localenddate"
                                          :rules="[requiredField]"
                                          type="date"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </q-card-section>
                              </q-card>
                            </q-expansion-item>
                          </q-list>
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-12">
                          <div class="text-h6 text-bold q-mb-md row items-center">
                            <IconSchool class="text-negative q-mr-sm" :size="40" stroke-width="2" />
                            <span class="text-h6 text-bold text-primary"
                              >Scholarship Informations</span
                            >
                          </div>
                          <q-separator />
                          <br />
                        </div>
                        <div class="col-xs-12">
                          <BaseSelect
                            ref="refScholarshipProgram"
                            title="Scholarship Program"
                            name="scholarshipProgram"
                            v-model="scholarshipProgram"
                            :options="scholarshipProgramOptions"
                            :filter-fn="filterScholarshipProgram"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseSelect
                            ref="refEntryType"
                            title="Entry Type"
                            name="entryType"
                            v-model="entryType"
                            :options="entryTypeOptions"
                            :filter-fn="filterEntryType"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            title="Academic Year"
                            ref="refacademicyear"
                            name="academicyear"
                            v-model="state.academicyear"
                            :rules="[requiredField]"
                            mask="####-####"
                            placeholder="YYYY-YYYY"
                            @update:model-value="
                              spas_academic_year = state.academicyear.substring(0, 4)
                            "
                          />
                        </div>

                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            title="Batch"
                            ref="refbatch"
                            name="batch"
                            v-model="state.batch"
                            :rules="[requiredField]"
                            type="number"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseSelect
                            ref="refgrant"
                            title="Grant"
                            name="grant"
                            v-model="grant"
                            :options="grantOptions"
                            :filter-fn="filterGrant"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseSelect
                            ref="reflevel"
                            title="Level"
                            name="level"
                            v-model="level"
                            :options="levelOptions"
                            :filter-fn="filterLevel"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInputRead title="Comp" name="comp" v-model="state.comp" />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseSelect
                            ref="refavailment"
                            title="Availment"
                            name="availment"
                            v-model="availment"
                            :options="availmentOptions"
                            :filter-fn="filterAvailment"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInputRead title="Status" name="otherstatus" v-model="availment" />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInputRead title="Semester" name="semester" v-model="state.batch" />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInputRead
                            title="Year of Award"
                            name="yearawarded"
                            v-model="spas_academic_year"
                          />
                        </div>
                        <div class="col-xs-12">
                          <BaseInput
                            title="Title of Research"
                            ref="refresearch"
                            name="research"
                            v-model="state.research"
                            :rules="[requiredField]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <UpdateSelect
                            ref="refscholartype"
                            title="Scholar Type"
                            name="scholartype"
                            v-model="scholartype"
                            :options="scholartypeOptions"
                            :onFilter="filterScholarType"
                            @update:modelValue="populateScholarType"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            title="Graduation Date"
                            ref="refgraduationdate"
                            name="graduationdate"
                            v-model="state.graduationdate"
                            :rules="[requiredField]"
                            mask="####-##"
                            placeholder="YYYY-MM"
                          />
                        </div>
                        <div class="col-xs-12">
                          <BaseInput
                            title="Honors/Awards Received"
                            ref="refhonorsawards"
                            name="honorsawards"
                            v-model="state.honorsawards"
                            :rules="[requiredField]"
                          />
                        </div>
                        <div class="col-xs-12">
                          <BaseInput
                            title="Dissemination Grant"
                            ref="refdissemination"
                            name="dissemination"
                            v-model="state.dissemination"
                            :rules="[requiredField]"
                          />
                        </div>
                        <div class="col-xs-12">
                          <BaseInput
                            title="Research Grant"
                            ref="refresearchGrant"
                            name="researchgrant"
                            v-model="state.researchgrant"
                            :rules="[requiredField]"
                          />
                        </div>
                        <div class="col-xs-12">
                          <BaseInput
                            title="Service Obligation"
                            ref="refserviceobligation"
                            name="serviceobligation"
                            v-model="state.serviceobligation"
                            type="number"
                            :rules="[requiredField]"
                          />
                        </div>
                        <div class="col-xs-12">
                          <BaseInput
                            title="Remarks"
                            ref="refremarks"
                            name="remarks"
                            v-model="state.remarks"
                            :rules="[requiredField]"
                          />
                        </div>
                      </div></div
                  ></q-scroll-area>
                </q-card-section>
              </div>
            </form>
          </q-card>
        </div>
      </div>
    </div>
  </div>

  <q-dialog v-model="docxUpload" persistent>
    <q-card class="rounded-borders-20" style="width: 700px; max-width: 80vw">
      <q-toolbar>
        <IconFileTypeCsv :size="30" stroke-width="2" />

        <q-toolbar-title
          ><span class="text-weight-bold" color="primary">CSV</span> File Upload</q-toolbar-title
        >

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <q-form id="bulkUploadForm" @submit.prevent.stop="bulkUploads">
          <q-card class="my-card rounded-borders-20">
            <q-card-section class="bg-primary text-white">
              <div class="text-h6">Upload Your File Here</div>
              <div class="text-subtitle2">Only CSV Documents are Allowed</div>
            </q-card-section>
            <div class="q-pa-md">
              <BaseFile
                ref="refBulkUpload"
                v-model="bulkuploadScholars"
                name="bulkuploadScholars"
                label="*CSV FILES ONLY"
                accept=".csv"
                :rules="[fileRules]"
              />
            </div>
          </q-card>
          <br />
          <div class="row justify-end">
            <q-btn type="submit" label="Upload" color="primary" />
          </div>
        </q-form>
      </q-card-section>

      <q-separator />
    </q-card>
  </q-dialog>
</template>

<script setup>
import BaseBtn from '../components/BaseBtn.vue'
import BaseInput from '../components/BaseInput.vue'
import BaseInputRead from '../components/BaseInputRead.vue'
import BaseFile from '../components/BaseFile.vue'

import BaseSelect from '../components/BaseSelect.vue'
import BaseBasicSelect from '../components/BaseBasicSelect.vue'
import UpdateSelect from '../components/UpdateSelect.vue'
import ScholarsTbl from '../components/ScholarsTbl.vue'
import UpdateSelectWthOutEmit from '../components/UpdateSelectWthOutEmit.vue'
import { ref, onMounted, reactive, inject, watch, computed } from 'vue'
import { notifySuccess, notifyError } from '../utils/notify'

import {
  IconListDetails,
  IconSquareRoundedX,
  IconFileTypePdf,
  IconFileSearch,
  IconFiles,
} from '@tabler/icons-vue'
import { useQuasar, QSpinnerGears, is } from 'quasar'
import { requiredField, isSelected, fileRules } from '../utils/validation'

import Swal from 'sweetalert2'
import { compileScript } from 'vue/compiler-sfc'

const user = inject('$user')
const q$ = useQuasar()
const $q = useQuasar()
const axios = inject('$axios')

const tab = ref('oscholars')
const docxUpload = ref(false)

const edittab = ref('sinfo')

const onrows = ref([])
const gradrows = ref([])
const termrows = ref([])

const refBulkUpload = ref(null)
const refspasid = ref(null)
const refStatus = ref(null)
const refSubStatus = ref(null)
const reffirstname = ref(null)
const reflastname = ref(null)
const refmiddlename = ref(null)
const refsuffixname = ref(null)
const refbirth = ref(null)
const refsex = ref(null)
const refemail = ref(null)
const refalemail = ref(null)
const refcontact = ref(null)
const refzipcode = ref(null)
const refblocklot = ref(null)
const refstreet = ref(null)
const refsubdivision = ref(null)
const refbarangay = ref(null)
const refdistrict = ref(null)
const refregion = ref(null)
const refmunicipality = ref(null)
const refprovince = ref(null)
const refPrevCourse = ref(null)
const refPrevSchool = ref(null)
const refScProg = ref(null)
const refunits = ref(null)
const refcouncil = ref(null)
const refgradschool = ref(null)
const refschoolregion = ref(null)
const refgradcourse = ref(null)
const refField = ref(null)
const refduration = ref(null)
const refForeignsemone = ref(null)
const refForeignstartdate = ref(null)
const refForeignsemtwo = ref(null)
const refForeignenddate = ref(null)
const refLocalsemone = ref(null)
const refLocalstartdate = ref(null)
const refLocalenddate = ref(null)
const refLocalsemtwo = ref(null)
const refScholarshipProgram = ref(null)
const refEntryType = ref(null)
const refacademicyear = ref(null)
const refbatch = ref(null)
const refgrant = ref(null)
const reflevel = ref(null)
const refcomp = ref(null)
const refavailment = ref(null)
const refotherstatus = ref(null)
const refsemester = ref(null)
const refyearawarded = ref(null)
const refremarks = ref(null)
const refserviceobligation = ref(null)
const refresearch = ref(null)
const refscholartype = ref(null)
const refgraduationdate = ref(null)
const refhonorsawards = ref(null)
const refdissemination = ref(null)
const refresearchGrant = ref(null)

const status = ref(null)
const substatus = ref(null)
const sex = ref(null)
const zipcode = ref(null)
const prevCourse = ref(null)
const prevschool = ref(null)
const scprog = ref(null)
const council = ref(null)
const gradschool = ref(null)
const gradcourse = ref(null)
const scholarshipProgram = ref(null)
const entryType = ref(null)
const grant = ref(null)
const level = ref(null)
const availment = ref(null)
const scholartype = ref(null)
const currentYear = ref(null)
const spas_academic_year = ref(null)
const isEditing = ref(false)
const bulkuploadScholars = ref(null)

const state = reactive({
  spasid: '',
  status: '',
  substatus: '',
  firstname: '',
  middlename: '',
  lastname: '',
  suffixname: '',
  birth: '',
  sex: '',
  email: '',
  alemail: '',
  contact: '',
  blocklot: '',
  street: '',
  subdivision: '',
  barangay: '',
  district: '',
  region: '',
  municipality: '',
  province: '',
  units: '',
  schoolregion: '',
  fields: '',
  duration: '',
  foreignsemone: '',
  foreignstartdate: '',
  foreignsemtwo: '',
  foreignenddate: '',
  localsemone: '',
  localstartdate: '',
  localenddate: '',
  localsemtwo: '',
  academicyear: '',
  batch: '',
  comp: '100m',
  otherstatus: '',
  semester: '',
  yearawarded: '',
  remarks: '',
  serviceobligation: '',
  research: '',
  graduationdate: '',
  honorsawards: '',
  dissemination: '',
  researchgrant: '',
})

const sexOptions = [
  { label: 'Male', value: 'M' },
  { label: 'Female', value: 'F' },
]

const columns = [
  {
    name: 'spas_id',
    required: true,
    label: 'SPAS ID',
    align: 'center',
    field: 'spas_id',
    sortable: true,
  },
  {
    name: 'lname',
    required: true,
    label: 'Last Name',
    align: 'center',
    field: 'lname',
    sortable: true,
  },
  {
    name: 'fname',
    required: true,
    label: 'First Name',
    align: 'center',
    field: 'fname',
    sortable: true,
  },
  {
    name: 'school_grad_status',
    required: true,
    label: 'Status',
    align: 'center',
    field: 'school_grad_status',
    sortable: true,
  },
  {
    name: 'sub_status',
    required: true,
    label: 'Secondary Status',
    align: 'center',
    field: 'sub_status',
    sortable: true,
  },
  {
    name: 'actions',
    align: 'center',
    label: 'Action Buttons',
    field: 'actions',
    sortable: true,
  },
]

const readScholars = () => {
  axios.get('/scholars_function.php?readscholar').then(function (response) {
    onrows.value = response.data
  })

  axios.get('/scholars_function.php?readgraduatescholar').then(function (response) {
    gradrows.value = response.data
  })

  axios.get('/scholars_function.php?readtermscholar').then(function (response) {
    termrows.value = response.data
  })

  axios.get('/scholars_function.php?readStatus').then((response) => {
    status2 = response.data
  })

  axios.get('/scholars_function.php?readSubStatus').then((response) => {
    substatus2 = response.data
  })

  axios.get('/scholars_function.php?readZip').then((response) => {
    zip2 = response.data
  })

  axios.get('/scholars_function.php?underGradCourses').then((response) => {
    prevCourse2 = response.data
  })

  axios.get('/scholars_function.php?underGradSchool').then((response) => {
    prevSchool2 = response.data
  })
  axios.get('/scholars_function.php?readScProg').then((response) => {
    ScProgram2 = response.data
  })

  axios.get('/scholars_function.php?readcouncil').then((response) => {
    council2 = response.data
  })

  axios.get('/scholars_function.php?readGradSchool').then((response) => {
    gradschool2 = response.data
  })

  axios.get('/scholars_function.php?readGradCourse').then((response) => {
    gradcourse2 = response.data
  })

  axios.get('/scholars_function.php?readScolarshipProgram').then((response) => {
    scholarshipProgram2 = response.data
  })

  axios.get('/scholars_function.php?readEntryType').then((response) => {
    entryType2 = response.data
  })

  axios.get('/scholars_function.php?readGrant').then((response) => {
    grant2 = response.data
  })

  axios.get('/scholars_function.php?readLevel').then((response) => {
    level2 = response.data
  })

  axios.get('/scholars_function.php?readAvailment').then((response) => {
    availment2 = response.data
  })

  axios.get('/scholars_function.php?readScholarType').then((response) => {
    scholartype2 = response.data
  })
}

const populateAddress = () => {
  var formData = new FormData()
  formData.append('zipid', zipcode.value)

  axios.post('/scholars_function.php?readZipAddress', formData).then(function (response) {
    state.municipality = response.data.zmun
    state.province = response.data.zpro
    state.barangay = response.data.zbar
    state.district = response.data.zdis
    state.region = response.data.zreg
  })
}

const populateschool = () => {
  var formData = new FormData()
  formData.append('schoolName', gradschool.value)

  axios.post('/scholars_function.php?gradSchoolPopulate', formData).then(function (response) {
    state.serviceobligation = response.data.duration
    state.schoolregion = response.data.school_region
  })
}

const gradschoolLabel = computed(() => {
  const selected = gradschoolOptions.value.find((option) => option.value === gradschool.value)
  return selected ? selected.label : ''
})

const populateCourseField = () => {
  var formData = new FormData()
  formData.append('schoolCourse', gradcourse.value)

  axios.post('/scholars_function.php?gradCoursePopulate', formData).then(function (response) {
    state.fields = response.data.field
  })
}

const populateScholarType = () => {
  var formData = new FormData()
  formData.append('scholarType_description', scholartype.value)

  axios.post('/scholars_function.php?scholarTypePopulate', formData).then(function (response) {
    state.serviceobligation = response.data.serv_obligation
  })
}

// const populateScholarType = () => {
//   state.serviceobligation = scholartype.value?.field
// }

const getCurrentYear = () => {
  const currentDate = new Date()
  currentYear.value = currentDate.getFullYear()
}

// Auto polpulate codes Here

var status2 = []
const statusOptions = ref(status2)
var substatus2 = []
const substatusOptions = ref(substatus2)
var zip2 = []
const zipcodeOptions = ref(zip2)
var prevCourse2 = []
const prevCourseOptions = ref(prevCourse2)
var prevSchool2 = []
const prevSchoolOptions = ref(prevSchool2)
var ScProgram2 = []
const ScProgramOptions = ref(ScProgram2)
var council2 = []
const councilOptions = ref(council2)
var gradschool2 = []
const gradschoolOptions = ref(gradschool2)
var gradcourse2 = []
const gradcourseOptions = ref(gradcourse2)
var scholarshipProgram2 = []
const scholarshipProgramOptions = ref(scholarshipProgram2)
var entryType2 = []
const entryTypeOptions = ref(entryType2)
var grant2 = []
const grantOptions = ref(grant2)
var level2 = []
const levelOptions = ref(level2)
var availment2 = []
const availmentOptions = ref(availment2)
var scholartype2 = []
const scholartypeOptions = ref(scholartype2)

const filterStatus = (val, update, abort) => {
  if (val === '') {
    update(() => {
      statusOptions.value = status2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    statusOptions.value = status2.filter(
      (option) =>
        option.label.toLowerCase().includes(needle) || option.value.toLowerCase().includes(needle),
    )
  })
}

const filterSubStatus = (val, update, abort) => {
  if (val === '') {
    update(() => {
      substatusOptions.value = substatus2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    substatusOptions.value = substatus2.filter(
      (option) =>
        option.label.toLowerCase().includes(needle) || option.value.toLowerCase().includes(needle),
    )
  })
}

const filterZipcode = (val, update) => {
  if (val === '') {
    update(() => {
      zipcodeOptions.value = zip2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    zipcodeOptions.value = zip2.filter((option) => {
      return option.label.toLowerCase().includes(needle)
    })
  })
}

const filterPrevCourse = (val, update, abort) => {
  if (val === '') {
    update(() => {
      prevCourseOptions.value = prevCourse2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    prevCourseOptions.value = prevCourse2.filter(
      (option) =>
        option.label.toLowerCase().includes(needle) || option.value.toLowerCase().includes(needle),
    )
  })
}

const filterPrevSchool = (val, update, abort) => {
  if (val === '') {
    update(() => {
      prevSchoolOptions.value = prevSchool2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    prevSchoolOptions.value = prevSchool2.filter(
      (option) =>
        option.label.toLowerCase().includes(needle) || option.value.toLowerCase().includes(needle),
    )
  })
}

const filterScProgram = (val, update, abort) => {
  if (val === '') {
    update(() => {
      ScProgramOptions.value = ScProgram2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    ScProgramOptions.value = ScProgram2.filter(
      (option) =>
        option.label.toLowerCase().includes(needle) || option.value.toLowerCase().includes(needle),
    )
  })
}

const filterCouncil = (val, update, abort) => {
  if (val === '') {
    update(() => {
      councilOptions.value = council2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    councilOptions.value = council2.filter(
      (option) =>
        option.label.toLowerCase().includes(needle) || option.value.toLowerCase().includes(needle),
    )
  })
}

const filterGradschool = (val, update) => {
  if (val === '') {
    update(() => {
      gradschoolOptions.value = gradschool2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    gradschoolOptions.value = gradschool2.filter((option) => {
      return option.label.toLowerCase().includes(needle)
    })
  })
}

const filterGradcourse = (val, update) => {
  if (val === '') {
    update(() => {
      gradcourseOptions.value = gradcourse2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    gradcourseOptions.value = gradcourse2.filter((option) => {
      return option.label.toLowerCase().includes(needle)
    })
  })
}

const filterScholarshipProgram = (val, update) => {
  if (val === '') {
    update(() => {
      scholarshipProgramOptions.value = scholarshipProgram2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    scholarshipProgramOptions.value = scholarshipProgram2.filter((option) => {
      return option.label.toLowerCase().includes(needle)
    })
  })
}

const filterEntryType = (val, update) => {
  if (val === '') {
    update(() => {
      entryTypeOptions.value = entryType2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    entryTypeOptions.value = entryType2.filter((option) => {
      return option.label.toLowerCase().includes(needle)
    })
  })
}

const filterGrant = (val, update) => {
  if (val === '') {
    update(() => {
      grantOptions.value = grant2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    grantOptions.value = grant2.filter((option) => {
      return option.label.toLowerCase().includes(needle)
    })
  })
}

const filterLevel = (val, update) => {
  if (val === '') {
    update(() => {
      levelOptions.value = level2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    levelOptions.value = level2.filter((option) => {
      return option.label.toLowerCase().includes(needle)
    })
  })
}

const filterAvailment = (val, update) => {
  if (val === '') {
    update(() => {
      availmentOptions.value = availment2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    availmentOptions.value = availment2.filter((option) => {
      return option.label.toLowerCase().includes(needle)
    })
  })
}

const filterScholarType = (val, update) => {
  if (val === '') {
    update(() => {
      scholartypeOptions.value = scholartype2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    scholartypeOptions.value = scholartype2.filter((option) => {
      return option.label.toLowerCase().includes(needle)
    })
  })
}

const scholarid = ref(null)
// Other Functions

const handleRowClick = (evt, row) => {
  isEditing.value = true
  state.spasid = row.spas_id
  status.value = row.school_grad_status
  substatus.value = row.sub_status
  state.firstname = row.fname
  state.middlename = row.mname
  state.lastname = row.lname
  state.suffixname = row.suffix
  state.birth = row.birthday
  sex.value = row.sex
  state.email = row.email
  state.alemail = row.alternate_email
  state.contact = row.contact

  scholarid.value = row.id

  var formData = new FormData()
  formData.append('scholarid', scholarid.value)

  axios.post('/scholars_function.php?readAddressId', formData).then(function (response) {
    zipcode.value = response.data.zipcode
    state.blocklot = response.data.house_number
    state.street = response.data.street
    state.subdivision = response.data.subdivision
    state.barangay = response.data.barangay
    state.district = response.data.district
    state.region = response.data.h_region
    state.municipality = response.data.town
    state.province = response.data.province
  })

  axios.post('/scholars_function.php?readSchoolsId', formData).then(function (response) {
    prevCourse.value = response.data.current_course
    prevschool.value = response.data.current_school
    scprog.value = response.data.scholarship_program
    state.units = response.data.units
    state.batch = response.data.batch
    entryType.value = response.data.entry_level
    spas_academic_year.value = response.data.year
  })
  axios.post('/scholars_function.php?readGradSchoolsId', formData).then(function (response) {
    council.value = response.data.council
    gradschool.value = response.data.grad_school
    gradcourse.value = response.data.grad_course
    state.schoolregion = response.data.region
    state.comp = response.data.comp
    grant.value = response.data.grant_test
    scholarshipProgram.value = response.data.grad_program
    state.academicyear = response.data.award_year
    level.value = response.data.level
    availment.value = response.data.availment
    state.semester = response.data.sem
  })

  axios.post('/scholars_function.php?readThesisId', formData).then(function (response) {
    state.research = response.data.title
    scholartype.value = response.data.school_type
    state.graduationdate = response.data.grad_date
    state.honorsawards = response.data.honors
    state.dissemination = response.data.dissemination
    state.researchgrant = response.data.research
    state.serviceobligation = response.data.servob
    state.remarks = response.data.remarks
    state.duration = response.data.duration
    state.fields = response.data.field
  })

  axios.post('/scholars_function.php?readDateSemId', formData).then(function (response) {
    state.foreignsemone = response.data.foreign_sem
    state.foreignstartdate = response.data.foreign_startdate
    state.foreignsemtwo = response.data.foreign_endsem
    state.foreignenddate = response.data.foreign_enddate
    state.localsemone = response.data.local_sem
    state.localstartdate = response.data.local_startdate
    state.localsemtwo = response.data.local_endsem
    state.localenddate = response.data.local_enddate
  })
}

const submitScholar = async () => {
  const isFirstNameValid = await reffirstname.value.validate()
  const isLastNameValid = await reflastname.value.validate()
  const isBirthdayValid = await refbirth.value.validate()
  const isSexValid = await refsex.value.validate()
  const isEmailValid = await refemail.value.validate()
  const isAlEmailValid = await refalemail.value.validate()
  const isContactValid = await refcontact.value.validate()
  const isZipcodeValid = await refzipcode.value.validate()
  const isBlocklotValid = await refblocklot.value.validate()
  const isStreetValid = await refstreet.value.validate()
  const isPrevCourseValid = await refPrevCourse.value.validate()
  const isPrevSchoolValid = await refPrevSchool.value.validate()
  const isScProgValid = await refScProg.value.validate()
  const isUnitsValid = await refunits.value.validate()
  const isCouncilValid = await refcouncil.value.validate()
  const isGradSchoolValid = await refgradschool.value.validate()
  const isGradCourseValid = await refgradcourse.value.validate()
  const isDurationValid = await refduration.value.validate()
  const isScholarshipProgramValid = await refScholarshipProgram.value.validate()
  const isEntryTypeValid = await refEntryType.value.validate()
  const isAcademicyearValid = await refacademicyear.value.validate()
  const isBatchValid = await refbatch.value.validate()
  const isGrantValid = await refgrant.value.validate()
  const isLevelValid = await reflevel.value.validate()
  const isAvailmentValid = await refavailment.value.validate()
  const isServiceObligationValid = await refserviceobligation.value.validate()
  const isScholarTypeValid = await refscholartype.value.validate()
  const isRemarksValid = await refremarks.value.validate()

  if (
    !isFirstNameValid ||
    !isLastNameValid ||
    !isBirthdayValid ||
    !isSexValid ||
    !isEmailValid ||
    !isAlEmailValid ||
    !isContactValid ||
    !isZipcodeValid ||
    !isBlocklotValid ||
    !isStreetValid ||
    !isPrevCourseValid ||
    !isPrevSchoolValid ||
    !isScProgValid ||
    !isUnitsValid ||
    !isCouncilValid ||
    !isGradSchoolValid ||
    !isGradCourseValid ||
    !isDurationValid ||
    !isScholarshipProgramValid ||
    !isEntryTypeValid ||
    !isAcademicyearValid ||
    !isBatchValid ||
    !isGrantValid ||
    !isLevelValid ||
    !isAvailmentValid ||
    !isServiceObligationValid ||
    !isScholarTypeValid ||
    !isRemarksValid
  ) {
    notifyError('Please fill all required fields')
  } else {
    var formData = new FormData(document.getElementById('submitScholarForm'))

    formData.append('sex', sex.value)
    formData.append('prevschool', prevschool.value)
    formData.append('prevCourse', prevCourse.value)
    formData.append('scprog', scprog.value)
    formData.append('council', council.value)
    formData.append('scholarshipProgram', scholarshipProgram.value)
    formData.append('grant', grant.value)
    formData.append('level', level.value)
    formData.append('availment', availment.value)
    formData.append('scholartype', scholartype.value)
    formData.append('entryType', entryType.value)
    formData.append('gradschool', gradschool.value)
    formData.append('gradcourse', gradcourse.value)
    formData.append('yearawarded', spas_academic_year.value)
    formData.append('usercreator', user.username)
    formData.append('scholarid', scholarid.value)
    formData.append('status', status.value)
    formData.append('substatus', substatus.value)

    if (isEditing.value) {
      const isStatusValid = await refStatus.value.validate()
      const isSubStatusValid = await refSubStatus.value.validate()
      if (!isStatusValid || !isSubStatusValid) {
        notifyError('Please fill all required fields')
      } else {
        axios.post('/scholars_function.php?updateScholarinfo', formData).then(function (response) {
          if (response.data == true) {
            notifySuccess('Scholar Profile Information Updated Successfully')
          } else {
            notifyError('Failed to Update')
          }
        })

        axios
          .post('/scholars_function.php?updatescholarAddress', formData)
          .then(function (response) {
            if (response.data == true) {
              notifySuccess('Scholar Address Updated Successfully')
            } else {
              notifyError('Failed to Update')
            }
          })
      }

      axios.post('/scholars_function.php?updatescholarPrev', formData).then(function (response) {
        if (response.data == true) {
          notifySuccess('Scholar Previous School Updated Successfully')
        } else {
          notifyError('Failed to Update')
        }
      })

      axios
        .post('/scholars_function.php?updateGradScholarschool', formData)
        .then(function (response) {
          if (response.data == true) {
            notifySuccess('Scholar Graduate School Updated Successfully')
          } else {
            notifyError('Failed to Update')
          }
        })

      axios.post('/scholars_function.php?updateDateSem', formData).then(function (response) {
        if (response.data == true) {
          notifySuccess('Scholar Sem/Date Updated Successfully')
        } else {
          notifyError('Failed to Update')
        }
      })

      axios.post('/scholars_function.php?updateGradThesis', formData).then(function (response) {
        if (response.data == true) {
          readScholars()
          notifySuccess('Scholar Thesis Updated Successfully')
        } else {
          notifyError('Failed to Update')
        }
      })
    } else {
      axios.post('/scholars_function.php?createScholar', formData).then(function (response) {
        if (response.data == true) {
          readScholars()
          notifySuccess('Scholar Created Successfully')
        } else {
          notifyError('Error Submitting Form')
        }
      })
    }
  }
}

const bulkUploads = async () => {
  const isFileValid = await refBulkUpload.value.validate()

  if (!isFileValid) {
    alert('Please fill all required fields')
  }

  alert('Test ME')
}

const handleFiles = (props) => {
  alert(props.row.id)
}

const newScholar = () => {
  location.reload()
}

onMounted(() => {
  readScholars()
  populateAddress()
  populateschool()
  populateCourseField()
  getCurrentYear()
})
</script>
